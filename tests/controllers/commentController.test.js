// tests/controllers/commentController.test.js

const commentController = require('../../src/controllers/commentController');
const db = require('../../config/database');

jest.mock('../../config/database');

describe('Comment Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      params: { projectId: 1 },
      body: { content: 'Test comment' },
      user: { id: 1 }
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test('getComments should return comments for a project', async () => {
    const mockComments = [{ id: 1, content: 'Test comment', user_name: 'Test User' }];
    db.query.mockResolvedValue({ rows: mockComments });

    await commentController.getComments(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockComments);
  });

  test('addComment should create a new comment', async () => {
    const mockNewComment = { id: 1, content: 'Test comment', created_at: new Date() };
    db.query.mockResolvedValue({ rows: [mockNewComment] });

    await commentController.addComment(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockNewComment);
  });
});
