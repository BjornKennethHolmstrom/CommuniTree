// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.login);

// You can add more auth-related routes here, such as:
// router.post('/register', authController.register);
// router.post('/logout', authController.logout);
// router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
