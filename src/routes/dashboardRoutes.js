// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/projects', auth, dashboardController.getUserProjects);
router.get('/volunteer-activities', auth, dashboardController.getVolunteerActivities);
router.get('/impact-stats', auth, dashboardController.getImpactStats);

module.exports = router;
