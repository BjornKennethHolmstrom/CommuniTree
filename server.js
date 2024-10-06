const express = require('express');
const cors = require('cors');
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

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import database configuration
const db = require('./config/database');

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

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export the app
module.exports = app;
