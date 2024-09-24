// tests/controllers/eventController.test.js
const eventController = require('../../src/controllers/eventController');
const Event = require('../../src/models/event'); // You might need to create this model

jest.mock('../../src/models/event');

describe('Event Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test('createEvent should create a new event', async () => {
    const mockEvent = { id: 1, title: 'Test Event' };
    Event.create.mockResolvedValue(mockEvent);

    mockRequest.body = { title: 'Test Event', description: 'Test Description' };

    await eventController.createEvent(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
  });

  test('getEvents should return a list of events', async () => {
    const mockEvents = [{ id: 1, title: 'Event 1' }, { id: 2, title: 'Event 2' }];
    Event.getAll.mockResolvedValue(mockEvents);

    await eventController.getEvents(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
  });

  // Add more tests for other event controller methods
});
