// src/controllers/eventController.js

const Event = require('../models/event');

const eventController = {
  async createEvent(req, res) {
    try {
      const { title, description, start_time, end_time, location } = req.body;
      const organizer_id = req.user.id; // Assuming you have authentication middleware

      const event = await Event.create({
        title,
        description,
        start_time,
        end_time,
        location,
        organizer_id
      });

      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event', details: error.message });
    }
  },

  async getAllEvents(req, res) {
    try {
      const { communityId } = req.query;
      const events = await Event.getAll(communityId);
      res.status(200).json(events);
    } catch (error) {
      console.error('Error getting all events:', error);
      res.status(500).json({ message: 'Failed to get events' });
    }
  },

  async getEvents(req, res) {
    try {
      const events = await Event.getAll();
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    }
  },

  async updateEvent(req, res) {
    try {
      const event = await Event.update(req.params.id, req.body);
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating event' });
    }
  },

  async deleteEvent(req, res) {
    try {
      await Event.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting event' });
    }
  },

  async getRSVPStatus(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;
      const status = await Event.getRSVPStatus(eventId, userId);
      res.json({ status });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching RSVP status' });
    }
  },

  async updateRSVP(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;
      const { status } = req.body;
      const updatedRSVP = await Event.updateRSVP(eventId, userId, status);
      res.json(updatedRSVP);
    } catch (error) {
      res.status(500).json({ error: 'Error updating RSVP' });
    }
  },

  async getEventAttendees(req, res) {
    try {
      const { eventId } = req.params;
      const attendees = await Event.getAttendees(eventId);
      res.json(attendees);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching event attendees' });
    }
  }
};

module.exports = eventController;
