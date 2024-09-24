// tests/routes/eventRoutes.test.js

const request = require('supertest');
const express = require('express');
const eventRoutes = require('../../src/routes/eventRoutes');
const eventController = require('../../src/controllers/eventController');

jest.mock('../../src/controllers/eventController');
jest.mock('../../src/middleware/auth', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});
jest.mock('../../src/middleware/checkPermission', () => () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

describe('Event Routes', () => {
  test('POST /events should create a new event', async () => {
    const newEvent = { title: 'Test Event', description: 'Test Description' };
    const mockCreatedEvent = { id: 1, ...newEvent };
    eventController.createEvent.mockImplementation((req, res) => res.status(201).json(mockCreatedEvent));

    const response = await request(app).post('/events').send(newEvent);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockCreatedEvent);
  });

  test('GET /events should return all events', async () => {
    const mockEvents = [{ id: 1, title: 'Test Event' }];
    eventController.getEvents.mockImplementation((req, res) => res.json(mockEvents));

    const response = await request(app).get('/events');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockEvents);
  });

  test('PUT /events/:id should update an event', async () => {
    const updatedEvent = { title: 'Updated Event' };
    const mockUpdatedEvent = { id: 1, ...updatedEvent };
    eventController.updateEvent.mockImplementation((req, res) => res.json(mockUpdatedEvent));

    const response = await request(app).put('/events/1').send(updatedEvent);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUpdatedEvent);
  });

  test('DELETE /events/:id should delete an event', async () => {
    eventController.deleteEvent.mockImplementation((req, res) => res.status(204).end());

    const response = await request(app).delete('/events/1');
    expect(response.statusCode).toBe(204);
  });

  // Add tests for RSVP and attendees routes
});
