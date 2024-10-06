// src/models/user.js

const db = require('../../config/database');
const bcrypt = require('bcryptjs');

const User = {
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  },

  async create(userData) {
    const { name, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(query, [name, email, hashedPassword]);
    return result.rows[0];
  },

  async addToCommunity(userId, communityId, role = 'MEMBER') {
    const query = 'INSERT INTO community_memberships (user_id, community_id, role) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(query, [userId, communityId, role]);
    return result.rows[0];
  },

  async removeFromCommunity(userId, communityId) {
    const query = 'DELETE FROM community_memberships WHERE user_id = $1 AND community_id = $2';
    await db.query(query, [userId, communityId]);
  },

  async getCommunities(userId) {
    const query = `
      SELECT c.*, cm.role
      FROM communities c
      JOIN community_memberships cm ON c.id = cm.community_id
      WHERE cm.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }
};

module.exports = User;
