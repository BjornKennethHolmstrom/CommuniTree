// src/routes/communityRoutes.js

const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Create a new community (admin only)
router.post('/', auth, checkPermission('admin'), communityController.createCommunity);

// Get all communities
router.get('/', auth, communityController.getAllCommunities);

// Get a specific community
router.get('/:id', auth, communityController.getCommunityById);

// Update a community (admin only)
router.put('/:id', auth, checkPermission('admin'), communityController.updateCommunity);

// Delete a community (admin only)
router.delete('/:id', auth, checkPermission('admin'), communityController.deleteCommunity);

// Join a community
router.post('/:communityId/join', auth, communityController.joinCommunity);

// Leave a community
router.post('/:communityId/leave', auth, communityController.leaveCommunity);

// Get community members
router.get('/:communityId/members', auth, communityController.getCommunityMembers);

// Check membership
router.get('/:id/membership', auth, communityController.checkMembership);

// Update member role (admin only)
router.put('/:communityId/members/:userId', auth, checkPermission('admin'), communityController.updateMemberRole);

// Get weather for a community
router.get('/:id/weather', auth, communityController.getWeather);

module.exports = router;
