// tests/routes/notificationRoutes.test.js

const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../../src/routes/notificationRoutes');
const db = require('../../config/database');

jest.mock('../../config/database');
jest.mock('../../src/middleware/auth', () => (req, res, next) => {
  req.user = { id: 1, isAdmin: false };
  next();
});

const app = express();
app.use(express.json());
app.use('/notifications', notificationRoutes);

describe('Notification Routes', () => {
  test('GET /notifications should return all notifications for the user', async () => {
    const mockNotifications = [{ id: 1, content: 'Test notification', user_id: 1 }];
    db.query.mockResolvedValue({ rows: mockNotifications });

    const response = await request(app).get('/notifications');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockNotifications);
  });

  test('POST /notifications should create a new notification', async () => {
    const newNotification = { user_id: 1, content: 'New test notification', type: 'info' };
    const mockCreatedNotification = { id: 2, ...newNotification };
    db.query.mockResolvedValue({ rows: [mockCreatedNotification] });

    const response = await request(app).post('/notifications').send(newNotification);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockCreatedNotification);
  });

  test('PATCH /notifications/:id should mark a notification as read', async () => {
    const mockUpdatedNotification = { id: 1, read: true };
    db.query.mockResolvedValue({ rows: [mockUpdatedNotification] });

    const response = await request(app).patch('/notifications/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUpdatedNotification);
  });
});
