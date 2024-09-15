// src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.post('/', auth, eventController.createEvent);
router.get('/', eventController.getEvents);
router.put('/:id', auth, checkPermission('event'), eventController.updateEvent);
router.delete('/:id', auth, checkPermission('event'), eventController.deleteEvent);

router.get('/:eventId/rsvp', auth, eventController.getRSVPStatus);
router.post('/:eventId/rsvp', auth, eventController.updateRSVP);
router.get('/:eventId/attendees', auth, eventController.getEventAttendees);

module.exports = router;
