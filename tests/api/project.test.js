const request = require('supertest');
const app = require('../../server');
const Project = require('../../src/models/project');
const auth = require('../../src/middleware/auth');

jest.mock('../../src/models/project');
jest.mock('../../src/middleware/auth');

describe('Project API', () => {
  beforeEach(() => {
    auth.mockImplementation((req, res, next) => {
      req.user = { id: 1, role: 'user' };
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const mockProjects = [{ id: 1, title: 'Test Project', description: 'This is a test project' }];
      Project.getAll.mockResolvedValue({ projects: mockProjects, total: 1 });

      const res = await request(app).get('/api/projects');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.projects)).toBeTruthy();
      expect(res.body.projects.length).toBeGreaterThan(0);
      expect(res.body.projects[0]).toHaveProperty('title', 'Test Project');
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const newProject = { title: 'New Test Project', description: 'This is a new test project' };
      Project.create.mockResolvedValue({ id: 2, ...newProject, creator_id: 1 });

      const res = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title', 'New Test Project');
      expect(res.body).toHaveProperty('description', 'This is a new test project');
      expect(res.body).toHaveProperty('creator_id', 1);
    });
  });

  // Add more test cases for updating and deleting projects
});
