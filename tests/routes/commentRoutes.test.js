// tests/routes/commentRoutes.test.js

const request = require('supertest');
const express = require('express');
const commentRoutes = require('../../src/routes/commentRoutes');
const commentController = require('../../src/controllers/commentController');

jest.mock('../../src/controllers/commentController');
jest.mock('../../src/middleware/auth', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});

const app = express();
app.use(express.json());
app.use('/projects', commentRoutes);

describe('Comment Routes', () => {
  test('GET /projects/:projectId/comments should return comments for a project', async () => {
    const mockComments = [{ id: 1, content: 'Test comment' }];
    commentController.getComments.mockImplementation((req, res) => res.json(mockComments));

    const response = await request(app).get('/projects/1/comments');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockComments);
  });

  test('POST /projects/:projectId/comments should add a new comment', async () => {
    const newComment = { content: 'New test comment' };
    const mockCreatedComment = { id: 2, ...newComment };
    commentController.addComment.mockImplementation((req, res) => res.status(201).json(mockCreatedComment));

    const response = await request(app).post('/projects/1/comments').send(newComment);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockCreatedComment);
  });
});
