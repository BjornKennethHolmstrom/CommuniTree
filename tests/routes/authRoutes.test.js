// tests/routes/authRoutes.test.js

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/authRoutes');
const authController = require('../../src/controllers/authController');

jest.mock('../../src/controllers/authController');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  test('POST /auth/login should login a user', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockToken = 'mock-token';
    authController.login.mockImplementation((req, res) => res.json({ token: mockToken, user: mockUser }));

    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token', mockToken);
    expect(response.body).toHaveProperty('user', mockUser);
  });
});
