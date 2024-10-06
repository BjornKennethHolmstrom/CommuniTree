// tests/routes/fileRoutes.test.js

const request = require('supertest');
const express = require('express');
const fileRoutes = require('../../src/routes/fileRoutes');
const fileController = require('../../src/controllers/fileController');

jest.mock('../../src/controllers/fileController');
jest.mock('../../src/middleware/auth', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});
jest.mock('multer', () => {
  return jest.fn().mockImplementation(() => {
    return {
      single: jest.fn()
    };
  });
});
jest.mock('multer', () => {
  return () => ({
    diskStorage: jest.fn(),
    single: jest.fn().mockReturnValue((req, res, next) => next())
  });
});

const app = express();
app.use(express.json());
app.use('/projects', fileRoutes);

describe('File Routes', () => {
  test('GET /projects/:projectId/files should return files for a project', async () => {
    const mockFiles = [{ id: 1, file_name: 'test.txt' }];
    fileController.getProjectFiles.mockImplementation((req, res) => res.json(mockFiles));

    const response = await request(app).get('/projects/1/files');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockFiles);
  });

  test('POST /projects/:projectId/upload should upload a file', async () => {
    const mockUploadedFile = { id: 1, file_name: 'uploaded.txt' };
    fileController.uploadFile.mockImplementation((req, res) => res.status(201).json(mockUploadedFile));

    const response = await request(app).post('/projects/1/upload').attach('file', Buffer.from('test file content'), 'test.txt');
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockUploadedFile);
  });

  test('GET /projects/files/:fileId should download a file', async () => {
    fileController.downloadFile.mockImplementation((req, res) => res.download('test-path', 'test.txt'));

    const response = await request(app).get('/projects/files/1');
    expect(response.statusCode).toBe(200);
  });
});
