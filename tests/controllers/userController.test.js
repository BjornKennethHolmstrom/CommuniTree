// tests/controllers/userController.test.js

const userController = require('../../src/controllers/userController');
const User = require('../../src/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: { email: 'test@example.com', password: 'password123' }
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  test('login should return a token for valid credentials', async () => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
    User.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, 'mockToken');
    });

    await userController.login(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({ token: 'mockToken' });
  });

  test('login should return 400 for invalid credentials', async () => {
    User.findByEmail.mockResolvedValue(null);

    await userController.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
  });
});
