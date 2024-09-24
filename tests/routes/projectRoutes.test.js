// tests/routes/projectRoutes.test.js

const request = require('supertest');
const express = require('express');
const projectRoutes = require('../../src/routes/projectRoutes');
const projectController = require('../../src/controllers/projectController');

jest.mock('../../src/controllers/projectController');
jest.mock('../../src/middleware/auth', () => (req, res, next) => {
  req.user = { id: 1 };
  next();
});
jest.mock('../../src/middleware/checkPermission', () => () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/projects', projectRoutes);

describe('Project Routes', () => {
  test('POST /projects should create a new project', async () => {
    const newProject = { title: 'Test Project', description: 'Test Description' };
    const mockCreatedProject = { id: 1, ...newProject };
    projectController.createProject.mockImplementation((req, res) => res.status(201).json(mockCreatedProject));

    const response = await request(app).post('/projects').send(newProject);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockCreatedProject);
  });

  test('GET /projects should return all projects', async () => {
    const mockProjects = [{ id: 1, title: 'Test Project' }];
    projectController.getAllProjects.mockImplementation((req, res) => res.json(mockProjects));

    const response = await request(app).get('/projects');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockProjects);
  });

  test('GET /projects/:id should return a specific project', async () => {
    const mockProject = { id: 1, title: 'Test Project' };
    projectController.getProjectById.mockImplementation((req, res) => res.json(mockProject));

    const response = await request(app).get('/projects/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockProject);
  });

  test('PUT /projects/:id should update a project', async () => {
    const updatedProject = { title: 'Updated Project' };
    const mockUpdatedProject = { id: 1, ...updatedProject };
    projectController.updateProject.mockImplementation((req, res) => res.json(mockUpdatedProject));

    const response = await request(app).put('/projects/1').send(updatedProject);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUpdatedProject);
  });

  test('DELETE /projects/:id should delete a project', async () => {
    projectController.deleteProject.mockImplementation((req, res) => res.status(204).end());

    const response = await request(app).delete('/projects/1');
    expect(response.statusCode).toBe(204);
  });

  // Add tests for volunteer signup and project volunteers routes
});
