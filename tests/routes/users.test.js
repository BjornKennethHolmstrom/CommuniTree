// tests/routes/users.test.js

const request = require('supertest');
const express = require('express');
const usersRoutes = require('../../src/routes/users');
const db = require('../../config/database');

jest.mock('../../config/database');
jest.mock('../../src/middleware/auth', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

const app = express();
app.use(express.json());
app.use('/users', usersRoutes);

describe('Users Routes', () => {
  test('GET /users should return all users except the current user', async () => {
    const mockUsers = [{ id: 2, username: 'user2', name: 'User 2' }];
    db.query.mockResolvedValue({ rows: mockUsers });

    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  test('GET /users/:id should return a specific user', async () => {
    const mockUser = { id: 2, username: 'user2', name: 'User 2', email: 'user2@example.com' };
    db.query.mockResolvedValue({ rows: [mockUser] });

    const response = await request(app).get('/users/2');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  test('POST /users should create a new user', async () => {
    const newUser = { username: 'newuser', email: 'newuser@example.com' };
    const mockCreatedUser = { id: 3, ...newUser };
    db.query.mockResolvedValue({ rows: [mockCreatedUser] });

    const response = await request(app).post('/users').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockCreatedUser);
  });

  test('PUT /users/:id should update a user', async () => {
    const updatedUser = { username: 'updateduser', email: 'updated@example.com' };
    const mockUpdatedUser = { id: 2, ...updatedUser };
    db.query.mockResolvedValue({ rows: [mockUpdatedUser] });

    const response = await request(app).put('/users/2').send(updatedUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUpdatedUser);
  });

  test('DELETE /users/:id should delete a user', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 2 }] });

    const response = await request(app).delete('/users/2');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted successfully' });
  });
});
