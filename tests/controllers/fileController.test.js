// tests/controllers/fileController.test.js

const fileController = require('../../src/controllers/fileController');
const db = require('../../config/database');

jest.mock('../../config/database');

describe('File Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      params: { projectId: 1, fileId: 1 },
      user: { id: 1 },
      file: { filename: 'test.txt', mimetype: 'text/plain', size: 1024 }
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      download: jest.fn()
    };
  });

  test('getProjectFiles should return files for a project', async () => {
    const mockFiles = [{ id: 1, file_name: 'test.txt' }];
    db.query.mockResolvedValue({ rows: mockFiles });

    await fileController.getProjectFiles(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockFiles);
  });

  test('uploadFile should create a new file entry', async () => {
    const mockNewFile = { id: 1, file_name: 'test.txt' };
    db.query.mockResolvedValue({ rows: [mockNewFile] });

    await fileController.uploadFile(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockNewFile);
  });

  test('downloadFile should initiate file download', async () => {
    db.query.mockResolvedValue({ rows: [{ file_path: 'uploads/test.txt', file_name: 'test.txt' }] });

    await fileController.downloadFile(mockRequest, mockResponse);

    expect(mockResponse.download).toHaveBeenCalled();
  });
});
