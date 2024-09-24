// tests/controllers/dashboardController.test.js

const dashboardController = require('../../src/controllers/dashboardController');
const db = require('../../config/database');

jest.mock('../../config/database');

describe('Dashboard Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      user: { id: 1 }
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test('getUserProjects should return user projects', async () => {
    const mockProjects = [{ id: 1, title: 'Test Project', status: 'In Progress' }];
    db.query.mockResolvedValue({ rows: mockProjects });

    await dashboardController.getUserProjects(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockProjects);
  });

  test('getVolunteerActivities should return volunteer activities', async () => {
    const mockActivities = [{ id: 1, project_id: 1, project_title: 'Test Project', role: 'Volunteer', hours: 5 }];
    db.query.mockResolvedValue({ rows: mockActivities });

    await dashboardController.getVolunteerActivities(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockActivities);
  });

  test('getImpactStats should return impact statistics', async () => {
    const mockStats = { projects_created: 5, volunteering_hours: 20, communities_impacted: 3 };
    db.query.mockResolvedValue({ rows: [mockStats] });

    await dashboardController.getImpactStats(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(mockStats);
  });
});
