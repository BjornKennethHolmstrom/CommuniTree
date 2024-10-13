// tests/api/auth.test.js

const request = require('supertest');
const app = require('../../server');
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Authentication', () => {
  beforeAll(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await db.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      ['testuser', 'test@example.com', hashedPassword, 'user']
    );
  });

  afterAll(async () => {
    // Clean up test user
    await db.query('DELETE FROM users WHERE username = $1', ['testuser']);
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'testpassword'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.username).toEqual('testuser');
      expect(res.body.user.email).toEqual('test@example.com');
      expect(res.body.user.role).toEqual('user');

      // Verify the token
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded.user).toHaveProperty('id');
      expect(decoded.user.role).toEqual('user');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
    });

    it('should not login with non-existent username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'testpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
    });

    it('should handle server errors', async () => {
      // Temporarily break the database connection
      const originalQuery = db.query;
      db.query = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'testpassword'
        });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('msg', 'Server error');

      // Restore the database connection
      db.query = originalQuery;
    });
  });

  // Add more test suites for other authentication routes here
});
