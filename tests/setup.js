// tests/setup.js

const db = require('../config/database');

beforeAll(async () => {
  // Any global setup, like connecting to the database
});

afterAll(async () => {
  // Close the database connection
  await db.end();
});
