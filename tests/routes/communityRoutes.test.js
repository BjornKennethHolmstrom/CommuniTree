const request = require('supertest');
const express = require('express');
const communityRoutes = require('../../src/routes/communityRoutes');
const communityController = require('../../src/controllers/communityController');
const auth = require('../../src/middleware/auth');
const checkPermission = require('../../src/middleware/checkPermission');

jest.mock('../../src/controllers/communityController');
jest.mock('../../src/middleware/auth');
jest.mock('../../src/middleware/checkPermission');

const app = express();
app.use(express.json());
app.use('/api/communities', communityRoutes);

describe('Community Routes', () => {
  beforeEach(() => {
    auth.mockImplementation((req, res, next) => next());
    checkPermission.mockImplementation(() => (req, res, next) => next());
  });

  test('GET /api/communities should return all communities', async () => {
    const mockCommunities = [{ id: 1, name: 'Community 1' }, { id: 2, name: 'Community 2' }];
    communityController.getAllCommunities.mockImplementation((req, res) => {
      res.json(mockCommunities);
    });

    const response = await request(app).get('/api/communities');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockCommunities);
    expect(communityController.getAllCommunities).toHaveBeenCalled();
  });

  test('GET /api/communities/:id should return a specific community', async () => {
    const mockCommunity = { id: 1, name: 'Test Community' };
    communityController.getCommunityById.mockImplementation((req, res) => {
      res.json(mockCommunity);
    });

    const response = await request(app).get('/api/communities/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockCommunity);
    expect(communityController.getCommunityById).toHaveBeenCalled();
  });

  test('POST /api/communities should create a new community', async () => {
    const newCommunity = { name: 'New Community', description: 'A new test community' };
    communityController.createCommunity.mockImplementation((req, res) => {
      res.status(201).json(newCommunity);
    });

    const response = await request(app)
      .post('/api/communities')
      .send(newCommunity);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(newCommunity);
    expect(communityController.createCommunity).toHaveBeenCalled();
  });

  test('PUT /api/communities/:id should update a community', async () => {
    const updatedCommunity = { id: 1, name: 'Updated Community' };
    communityController.updateCommunity.mockImplementation((req, res) => {
      res.json(updatedCommunity);
    });

    const response = await request(app)
      .put('/api/communities/1')
      .send(updatedCommunity);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedCommunity);
    expect(communityController.updateCommunity).toHaveBeenCalled();
  });

  test('DELETE /api/communities/:id should delete a community', async () => {
    communityController.deleteCommunity.mockImplementation((req, res) => {
      res.sendStatus(204);
    });

    const response = await request(app).delete('/api/communities/1');

    expect(response.statusCode).toBe(204);
    expect(communityController.deleteCommunity).toHaveBeenCalled();
  });

  test('POST /api/communities/:id/join should join a community', async () => {
    communityController.joinCommunity.mockImplementation((req, res) => {
      res.json({ message: 'Successfully joined community' });
    });

    const response = await request(app).post('/api/communities/1/join');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Successfully joined community' });
    expect(communityController.joinCommunity).toHaveBeenCalled();
  });

  test('POST /api/communities/:id/leave should leave a community', async () => {
    communityController.leaveCommunity.mockImplementation((req, res) => {
      res.json({ message: 'Successfully left community' });
    });

    const response = await request(app).post('/api/communities/1/leave');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Successfully left community' });
    expect(communityController.leaveCommunity).toHaveBeenCalled();
  });

  test('GET /api/communities/:id/members should return community members', async () => {
    const mockMembers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
    communityController.getCommunityMembers.mockImplementation((req, res) => {
      res.json(mockMembers);
    });

    const response = await request(app).get('/api/communities/1/members');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockMembers);
    expect(communityController.getCommunityMembers).toHaveBeenCalled();
  });

  test('GET /api/communities/:id/membership should check membership', async () => {
    communityController.checkMembership.mockImplementation((req, res) => {
      res.json({ isMember: true });
    });

    const response = await request(app).get('/api/communities/1/membership');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ isMember: true });
    expect(communityController.checkMembership).toHaveBeenCalled();
  });
});
