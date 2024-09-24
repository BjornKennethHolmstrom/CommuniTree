const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const db = require('../../config/database');

const userController = {

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },

  async getAllUsers(req, res) {
    try {
      const result = await db.query('SELECT id, username, name FROM users WHERE id != $1 ORDER BY username', [req.user.id]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getUserById(req, res) {
    try {
      const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createUser(req, res) {
    const { username, email } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
        [username, email]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateUser(req, res) {
    const { username, email } = req.body;
    try {
      const result = await db.query(
        'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
        [username, email, req.params.id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.params.id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getUserProjects(req, res) {
    try {
      // Implement this method
      res.json({ message: 'Get user projects not implemented yet' });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user projects' });
    }
  },

  async getVolunteerActivities(req, res) {
    try {
      // Implement this method
      res.json({ message: 'Get volunteer activities not implemented yet' });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching volunteer activities' });
    }
  },

  async getImpactStats(req, res) {
    try {
      // Implement this method
      res.json({ message: 'Get impact stats not implemented yet' });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching impact stats' });
    }
  },
};

module.exports = userController;
