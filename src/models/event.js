// src/models/event.js

const db = require('../../config/database');

const Event = {
  async create(eventData) {
    try {
      const { title, description, start_time, end_time, location, creator_id, community_id } = eventData;
      const query = `
        INSERT INTO events (title, description, start_time, end_time, location, creator_id, community_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [title, description, start_time, end_time, location, creator_id, community_id];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async getAll(communityId) {
    try {
      const query = 'SELECT * FROM events WHERE community_id = $1 ORDER BY start_time ASC';
      const result = await db.query(query, [communityId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting all events:', error);
      throw error;
    }
  },

  async getById(id) {
    const query = 'SELECT * FROM events WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, eventData) {
    const { title, description, date, location } = eventData;
    const query = `
      UPDATE events
      SET title = $1, description = $2, date = $3, location = $4
      WHERE id = $5
      RETURNING *
    `;
    const values = [title, description, date, location, id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM events WHERE id = $1';
    await db.query(query, [id]);
  }
};

module.exports = Event;
