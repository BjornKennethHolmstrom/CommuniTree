const express = require('express');
const cors = require('cors');
const usersRouter = require('./src/routes/users');
const projectRoutes = require('./src/routes/projectRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const auth = require('./src/middleware/auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
//app.use('/api/messages', messageRoutes);

// Import database configuration
const db = require('./config/database');

// Use the users router
app.use('/api/users', usersRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', auth, messageRoutes);
app.use('/api/notifications', notificationRoutes); 

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
