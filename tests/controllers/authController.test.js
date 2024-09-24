// tests/controllers/authController.test.js

const authController = require('../../src/controllers/authController');
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../config/database');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        username: 'testuser',
        password: 'testpassword'
      }
    };
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  test('login should return token and user data for valid credentials', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      password: 'hashedpassword'
    };

    db.query.mockResolvedValue({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'mocktoken');
    });

    await authController.login(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({
      token: 'mocktoken',
      user: {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }
    });
  });

  test('login should return 400 for invalid credentials', async () => {
    db.query.mockResolvedValue({ rows: [] });

    await authController.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials' });
  });

  test('login should return 400 for incorrect password', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      password: 'hashedpassword'
    };

    db.query.mockResolvedValue({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(false);

    await authController.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials' });
  });

  test('login should handle server errors', async () => {
    db.query.mockRejectedValue(new Error('Database error'));

    await authController.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith('Server error');
  });
});
