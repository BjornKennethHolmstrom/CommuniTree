// tests/controllers/projectController.test.js
const projectController = require('../../src/controllers/projectController');
const Project = require('../../src/models/project');

jest.mock('../../src/models/project');

describe('Project Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test('createProject should create a new project', async () => {
    const mockProject = { id: 1, title: 'Test Project' };
    Project.create.mockResolvedValue(mockProject);

    mockRequest.body = { title: 'Test Project', description: 'Test Description' };

    await projectController.createProject(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockProject);
  });

  test('getAllProjects should return a list of projects', async () => {
    const mockProjects = [{ id: 1, title: 'Project 1' }, { id: 2, title: 'Project 2' }];
    Project.getAll.mockResolvedValue({ projects: mockProjects, total: 2 });

    mockRequest.query = { page: 1, limit: 10 };

    await projectController.getAllProjects(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({
      projects: mockProjects,
      currentPage: 1,
      totalPages: 1,
      totalProjects: 2
    });
  });

  // Add more tests for other project controller methods
});
