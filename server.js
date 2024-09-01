const express = require('express');
const cors = require('cors');
const usersRouter = require('./src/routes/users');
const projectRoutes = require('./src/routes/projectRoutes');
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
