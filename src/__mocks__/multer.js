// src/__mocks__/multer.js

const multer = () => ({
  single: jest.fn().mockReturnValue((req, res, next) => next()),
  array: jest.fn().mockReturnValue((req, res, next) => next())
});

multer.diskStorage = jest.fn().mockReturnValue({
  destination: jest.fn(),
  filename: jest.fn()
});

module.exports = multer;
