// tests/controllers/authController.test.js
const authController = require('../../src/controllers/authController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../config/database');

describe('Auth Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    // Mock JWT sign
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      if (callback) {
        callback(null, 'mock-token');
      }
      return 'mock-token';
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('login should return token and user data for valid credentials', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedPassword',
      role: 'user'
    };

    db.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValueOnce(true);

    await authController.login(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      user: {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role
      }
    });
  });

  test('login should return 400 for invalid credentials', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    await authController.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      msg: 'Invalid credentials' 
    });
  });

  test('login should handle server errors', async () => {
    db.query.mockRejectedValueOnce(new Error('Database error'));

    await authController.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith('Server error');
  });
});
