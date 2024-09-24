const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const dashboardController = require('../controllers/dashboardController');

// Logging middleware
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Dashboard routes (these should come before the /:id route)
router.get('/projects', auth, dashboardController.getUserProjects);
router.get('/volunteer-activities', auth, dashboardController.getVolunteerActivities);
router.get('/impact-stats', auth, dashboardController.getImpactStats);

// Existing routes
router.get('/', auth, userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// This should come after the more specific routes
router.get('/:id', userController.getUserById);

// Login route
router.post('/login', userController.login);

module.exports = router;
