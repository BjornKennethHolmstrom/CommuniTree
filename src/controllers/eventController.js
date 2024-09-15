// src/controllers/eventController.js
const db = require('../../config/database');

const eventController = {
  async createEvent(req, res) {
    try {
      const { title, description, start, end, location } = req.body;
      const organizer_id = req.user.id;
      const query = `
        INSERT INTO events (title, description, start_time, end_time, location, organizer_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [title, description, start, end, location, organizer_id];
      const result = await db.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  },

  async getEvents(req, res) {
    try {
      const query = 'SELECT * FROM events ORDER BY start_time ASC';
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    }
  },

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { title, description, start, end, location } = req.body;
      const query = `
        UPDATE events
        SET title = $1, description = $2, start_time = $3, end_time = $4, location = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6 AND organizer_id = $7
        RETURNING *
      `;
      const values = [title, description, start, end, location, id, req.user.id];
      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Event not found or you are not the organizer' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Error updating event' });
    }
  },

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM events WHERE id = $1 AND organizer_id = $2';
      const result = await db.query(query, [id, req.user.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found or you are not the organizer' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Error deleting event' });
    }
  }

  async getRSVPStatus(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;
      const query = 'SELECT status FROM event_rsvps WHERE event_id = $1 AND user_id = $2';
      const result = await db.query(query, [eventId, userId]);
      res.json(result.rows[0] || { status: null });
    } catch (error) {
      console.error('Error fetching RSVP status:', error);
      res.status(500).json({ error: 'Error fetching RSVP status' });
    }
  },

  async updateRSVP(req, res) {
    try {
      const { eventId } = req.params;
      const { status } = req.body;
      const userId = req.user.id;
      const query = `
        INSERT INTO event_rsvps (event_id, user_id, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (event_id, user_id) DO UPDATE SET status = $3, updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      const result = await db.query(query, [eventId, userId, status]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      res.status(500).json({ error: 'Error updating RSVP' });
    }
  },

  async getEventAttendees(req, res) {
    try {
      const { eventId } = req.params;
      const query = `
        SELECT u.id, u.name, er.status
        FROM event_rsvps er
        JOIN users u ON er.user_id = u.id
        WHERE er.event_id = $1
        ORDER BY er.created_at ASC
      `;
      const result = await db.query(query, [eventId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      res.status(500).json({ error: 'Error fetching event attendees' });
    }
  }

};

module.exports = eventController;
