const express = require('express');
const cors = require('cors');
const sharp = require('sharp');
const usersRouter = require('./src/routes/users');
const projectRoutes = require('./src/routes/projectRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const authRoutes = require('./src/routes/authRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const auth = require('./src/middleware/auth');
const userController = require('./src/controllers/userController');
const checkPermission = require('./src/middleware/checkPermission');
require('dotenv').config();
const scheduleWeatherUpdates = require('./src/schedulers/weatherScheduler');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

scheduleWeatherUpdates();

// Import database configuration
const db = require('./config/database');

app.get('/api/placeholder/:width/:height', async (req, res) => {
  try {
    const width = parseInt(req.params.width);
    const height = parseInt(req.params.height);
    
    // Create a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666"
          text-anchor="middle" dy=".3em">${width}x${height}</text>
      </svg>
    `;

    // Convert SVG to PNG
    const buffer = await sharp(Buffer.from(svg))
      .resize(width, height)
      .png()
      .toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(buffer);
  } catch (error) {
    console.error('Error generating placeholder:', error);
    res.status(500).send('Error generating placeholder image');
  }
});

// Use the users router
app.use('/api/users', usersRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', commentRoutes);
app.use('/api/projects', fileRoutes);
app.use('/api/messages', auth, messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', dashboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/communities', communityRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle database connection errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(500).json({
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }

  // Handle authentication errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Invalid or expired token',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Authentication error'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      error: err.message
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    error: `${req.method} ${req.url} does not exist`
  });
});

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ status: 'healthy', timestamp: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

module.exports = app;
