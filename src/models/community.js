// src/models/community.js

const db = require('../../config/database');

const Community = {
  async create(communityData) {
    const { name, description, latitude, longitude, timezone } = communityData;
    const query = `
      INSERT INTO communities (name, description, latitude, longitude, timezone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(query, [name, description, latitude, longitude, timezone]);
    return result.rows[0];
  },

  async getAll() {
    const query = 'SELECT * FROM communities';
    const result = await db.query(query);
    return result.rows;
  },

  async getById(id) {
    const query = 'SELECT * FROM communities WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, communityData) {
    const { name, description, latitude, longitude, timezone } = communityData;
    const query = `
      UPDATE communities
      SET name = $1, description = $2, latitude = $3, longitude = $4, timezone = $5
      WHERE id = $6
      RETURNING *
    `;
    const result = await db.query(query, [name, description, latitude, longitude, timezone, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM communities WHERE id = $1';
    await db.query(query, [id]);
  },

  async getMembers(communityId) {
    const query = `
      SELECT u.id, u.name, u.email, cm.role, cm.joined_at
      FROM users u
      JOIN community_memberships cm ON u.id = cm.user_id
      WHERE cm.community_id = $1
    `;
    const result = await db.query(query, [communityId]);
    return result.rows;
  },

  async updateMemberRole(communityId, userId, role) {
    const query = 'UPDATE community_memberships SET role = $1 WHERE community_id = $2 AND user_id = $3 RETURNING *';
    const result = await db.query(query, [role, communityId, userId]);
    return result.rows[0];
  },

  async checkMembership(communityId, userId) {
    const query = 'SELECT * FROM community_memberships WHERE community_id = $1 AND user_id = $2';
    const result = await db.query(query, [communityId, userId]);
    return result.rows.length > 0;
  }
};

module.exports = Community;
