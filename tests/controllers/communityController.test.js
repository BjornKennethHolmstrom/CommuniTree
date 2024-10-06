const communityController = require('../../src/controllers/communityController');
const Community = require('../../src/models/community');
const User = require('../../src/models/user');

// Mock the Community and User models
jest.mock('../../src/models/community');
jest.mock('../../src/models/user');

describe('Community Controller', () => {
  let mockRequest;
  let mockResponse;
  
  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      user: { id: 1 }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('createCommunity should create a new community', async () => {
    const communityData = { name: 'Test Community', description: 'A test community' };
    mockRequest.body = communityData;
    Community.create.mockResolvedValue(communityData);

    await communityController.createCommunity(mockRequest, mockResponse);

    expect(Community.create).toHaveBeenCalledWith(communityData);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(communityData);
  });

  test('getAllCommunities should return all communities', async () => {
    const communities = [{ id: 1, name: 'Community 1' }, { id: 2, name: 'Community 2' }];
    Community.getAll.mockResolvedValue(communities);

    await communityController.getAllCommunities(mockRequest, mockResponse);

    expect(Community.getAll).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(communities);
  });

  test('getCommunityById should return a specific community', async () => {
    const community = { id: 1, name: 'Test Community' };
    mockRequest.params.id = 1;
    Community.getById.mockResolvedValue(community);

    await communityController.getCommunityById(mockRequest, mockResponse);

    expect(Community.getById).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(community);
  });

  test('updateCommunity should update a community', async () => {
    const updatedCommunity = { id: 1, name: 'Updated Community' };
    mockRequest.params.id = 1;
    mockRequest.body = updatedCommunity;
    Community.update.mockResolvedValue(updatedCommunity);

    await communityController.updateCommunity(mockRequest, mockResponse);

    expect(Community.update).toHaveBeenCalledWith(1, updatedCommunity);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(updatedCommunity);
  });

  test('deleteCommunity should delete a community', async () => {
    mockRequest.params.id = 1;

    await communityController.deleteCommunity(mockRequest, mockResponse);

    expect(Community.delete).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  test('joinCommunity should add a user to a community', async () => {
    mockRequest.params.id = 1;
    User.addToCommunity.mockResolvedValue({ userId: 1, communityId: 1 });

    await communityController.joinCommunity(mockRequest, mockResponse);

    expect(User.addToCommunity).toHaveBeenCalledWith(1, 1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Successfully joined community' });
  });

  test('leaveCommunity should remove a user from a community', async () => {
    mockRequest.params.id = 1;

    await communityController.leaveCommunity(mockRequest, mockResponse);

    expect(User.removeFromCommunity).toHaveBeenCalledWith(1, 1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Successfully left community' });
  });

  test('getCommunityMembers should return members of a community', async () => {
    const members = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
    mockRequest.params.id = 1;
    Community.getMembers.mockResolvedValue(members);

    await communityController.getCommunityMembers(mockRequest, mockResponse);

    expect(Community.getMembers).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(members);
  });

  test('checkMembership should check if a user is a member of a community', async () => {
    mockRequest.params.id = 1;
    Community.checkMembership.mockResolvedValue(true);

    await communityController.checkMembership(mockRequest, mockResponse);

    expect(Community.checkMembership).toHaveBeenCalledWith(1, 1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ isMember: true });
  });
});
