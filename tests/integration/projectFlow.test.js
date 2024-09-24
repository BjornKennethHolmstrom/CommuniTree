// tests/integration/projectFlow.test.js

const request = require('supertest');
const app = require('../../server');
const db = require('../../config/database');

describe('Project Flow', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    
    // Login to get the auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    if (loginResponse.body && loginResponse.body.token) {
      authToken = loginResponse.body.token;
    } else {
      throw new Error('Login failed: No token received');
    }

    if (loginResponse.body && loginResponse.body.user && loginResponse.body.user.id) {
      userId = loginResponse.body.user.id;
    } else {
      throw new Error('Login failed: No user ID received');
    }
  });
    
    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    // Clean up
    await db.query('DELETE FROM projects WHERE creator_id = $1', [userId]);
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    await db.end();
  });

  test('Create project and add comment', async () => {
    // Create a project
    const projectResponse = await request(app)
      .post('/api/projects')
      .set('x-auth-token', authToken)
      .send({
        title: 'Test Project',
        description: 'This is a test project'
      });

    expect(projectResponse.statusCode).toBe(201);
    expect(projectResponse.body).toHaveProperty('id');

    const projectId = projectResponse.body.id;

    // Add a comment to the project
    const commentResponse = await request(app)
      .post(`/api/projects/${projectId}/comments`)
      .set('x-auth-token', authToken)
      .send({
        content: 'This is a test comment'
      });

    expect(commentResponse.statusCode).toBe(201);
    expect(commentResponse.body).toHaveProperty('id');
    expect(commentResponse.body.content).toBe('This is a test comment');

    // Get project details including comments
    const getProjectResponse = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('x-auth-token', authToken);

    expect(getProjectResponse.statusCode).toBe(200);
    expect(getProjectResponse.body).toHaveProperty('comments');
    expect(getProjectResponse.body.comments).toHaveLength(1);
    expect(getProjectResponse.body.comments[0].content).toBe('This is a test comment');
  });
});

test('Update project and delete project', async () => {
  // Create a project
  const createProjectResponse = await request(app)
    .post('/api/projects')
    .set('x-auth-token', authToken)
    .send({
      title: 'Project to Update',
      description: 'This project will be updated and deleted'
    });
  expect(createProjectResponse.statusCode).toBe(201);
  const projectId = createProjectResponse.body.id;

  // Update the project
  const updateProjectResponse = await request(app)
    .put(`/api/projects/${projectId}`)
    .set('x-auth-token', authToken)
    .send({
      title: 'Updated Project Title',
      description: 'This project has been updated'
    });
  expect(updateProjectResponse.statusCode).toBe(200);
  expect(updateProjectResponse.body.title).toBe('Updated Project Title');

  // Delete the project
  const deleteProjectResponse = await request(app)
    .delete(`/api/projects/${projectId}`)
    .set('x-auth-token', authToken);
  expect(deleteProjectResponse.statusCode).toBe(204);

  // Verify the project is deleted
  const getDeletedProjectResponse = await request(app)
    .get(`/api/projects/${projectId}`)
    .set('x-auth-token', authToken);
  expect(getDeletedProjectResponse.statusCode).toBe(404);
});

test('Create event and RSVP', async () => {
  // Create an event
  const createEventResponse = await request(app)
    .post('/api/events')
    .set('x-auth-token', authToken)
    .send({
      title: 'Test Event',
      description: 'This is a test event',
      date: new Date().toISOString(),
      location: 'Test Location'
    });
  expect(createEventResponse.statusCode).toBe(201);
  const eventId = createEventResponse.body.id;

  // RSVP to the event
  const rsvpResponse = await request(app)
    .post(`/api/events/${eventId}/rsvp`)
    .set('x-auth-token', authToken)
    .send({ status: 'attending' });
  expect(rsvpResponse.statusCode).toBe(200);

  // Get event attendees
  const attendeesResponse = await request(app)
    .get(`/api/events/${eventId}/attendees`)
    .set('x-auth-token', authToken);
  expect(attendeesResponse.statusCode).toBe(200);
  expect(attendeesResponse.body).toContainEqual(expect.objectContaining({
    id: userId,
    status: 'attending'
  }));
});
