// tests/api/project.test.js

const request = require('supertest');
const app = require('../../server');
const db = require('../../config/database');
const jwt = require('jsonwebtoken');

describe('Project API', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Create a test user
    const userResult = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['testuser', 'test@example.com', 'hashedpassword', 'user']
    );
    testUserId = userResult.rows[0].id;

    // Create an auth token for the test user
    const payload = {
      user: {
        id: testUserId,
        role: 'user'
      }
    };
    authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a test project
    await db.query(
      'INSERT INTO projects (title, description, creator_id) VALUES ($1, $2, $3)',
      ['Test Project', 'This is a test project', testUserId]
    );
  });

  afterAll(async () => {
    // Clean up test data
    await db.query('DELETE FROM projects WHERE creator_id = $1', [testUserId]);
    await db.query('DELETE FROM users WHERE id = $1', [testUserId]);
    await db.end();
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('title', 'Test Project');
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'New Test Project',
          description: 'This is a new test project'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title', 'New Test Project');
      expect(res.body).toHaveProperty('description', 'This is a new test project');
      expect(res.body).toHaveProperty('creator_id', testUserId);
    });
  });

  // Add more test cases for updating and deleting projects
});
