// tests/routes/dashboardRoutes.test.js

const request = require('supertest');
const express = require('express');
const dashboardRoutes = require('../../src/routes/dashboardRoutes');
const dashboardController = require('../../src/controllers/dashboardController');

jest.mock('../../src/controllers/dashboardController');
jest.mock('../../src/middleware/auth', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/dashboard', dashboardRoutes);

describe('Dashboard Routes', () => {
  test('GET /dashboard/projects should return user projects', async () => {
    const mockProjects = [{ id: 1, title: 'Test Project' }];
    dashboardController.getUserProjects.mockImplementation((req, res) => res.json(mockProjects));

    const response = await request(app).get('/dashboard/projects');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockProjects);
  });

  test('GET /dashboard/volunteer-activities should return volunteer activities', async () => {
    const mockActivities = [{ id: 1, project_id: 1, role: 'Volunteer' }];
    dashboardController.getVolunteerActivities.mockImplementation((req, res) => res.json(mockActivities));

    const response = await request(app).get('/dashboard/volunteer-activities');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockActivities);
  });

  test('GET /dashboard/impact-stats should return impact stats', async () => {
    const mockStats = { projects_created: 5, volunteering_hours: 20 };
    dashboardController.getImpactStats.mockImplementation((req, res) => res.json(mockStats));

    const response = await request(app).get('/dashboard/impact-stats');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockStats);
  });
});
