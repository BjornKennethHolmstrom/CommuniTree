// tests/routes/messageRoutes.test.js

const request = require('supertest');
const express = require('express');
const messageRoutes = require('../../src/routes/messageRoutes');
const db = require('../../config/database');

jest.mock('../../config/database');
jest.mock('../../src/middleware/auth', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

const app = express();
app.use(express.json());
app.use('/messages', messageRoutes);

describe('Message Routes', () => {
  test('GET /messages should return all messages for the user', async () => {
    const mockMessages = [{ id: 1, content: 'Test message', sender_name: 'John Doe' }];
    db.query.mockResolvedValue({ rows: mockMessages });

    const response = await request(app).get('/messages');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockMessages);
  });

  test('POST /messages should create a new message', async () => {
    const newMessage = { recipient_id: 2, content: 'New test message' };
    const mockCreatedMessage = { id: 2, ...newMessage, sender_id: 1 };
    db.query.mockResolvedValue({ rows: [mockCreatedMessage] });

    const response = await request(app).post('/messages').send(newMessage);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockCreatedMessage);
  });

  test('PATCH /messages/:id should mark a message as read', async () => {
    const mockUpdatedMessage = { id: 1, read: true };
    db.query.mockResolvedValue({ rows: [mockUpdatedMessage] });

    const response = await request(app).patch('/messages/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUpdatedMessage);
  });
});
