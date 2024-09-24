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
  }
};

module.exports = User;
