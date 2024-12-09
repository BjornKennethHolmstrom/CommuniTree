// tests/controllers/communityController.test.js
const communityController = require('../../src/controllers/communityController');
const User = require('../../src/models/user');
const Community = require('../../src/models/community');
const Weather = require('../../src/models/weather');

jest.mock('../../src/models/user');
jest.mock('../../src/models/community');
jest.mock('../../src/models/weather');

describe('Community Controller', () => {
  let mockRequest;
  let mockResponse;
  
  beforeEach(() => {
    mockRequest = {
      params: { communityId: '1', id: '1' },
      user: { id: 1 }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('joinCommunity should add a user to a community', async () => {
    User.addToCommunity.mockResolvedValue({ userId: 1, communityId: 1 });
    
    await communityController.joinCommunity(mockRequest, mockResponse);
    
    expect(User.addToCommunity).toHaveBeenCalledWith(1, '1');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      message: 'Successfully joined community' 
    });
  });

  test('leaveCommunity should remove a user from a community', async () => {
    User.removeFromCommunity.mockResolvedValue(true);
    
    await communityController.leaveCommunity(mockRequest, mockResponse);
    
    expect(User.removeFromCommunity).toHaveBeenCalledWith(1, '1');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      message: 'Successfully left community' 
    });
  });

  test('getCommunityMembers should return members of a community', async () => {
    const members = [{ id: 1, name: 'Test User' }];
    Community.getMembers.mockResolvedValue(members);
    
    await communityController.getCommunityMembers(mockRequest, mockResponse);
    
    expect(Community.getMembers).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(members);
  });

  test('getWeather should return weather data for a community', async () => {
    const mockWeatherData = {
      weather: 'Sunny',
      temperature: 20
    };
    Weather.getLatestForCommunity.mockResolvedValue(mockWeatherData);
    
    await communityController.getWeather(mockRequest, mockResponse);
    
    expect(Weather.getLatestForCommunity).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockWeatherData);
  });

  test('getWeather should return 404 if no weather data is found', async () => {
    Weather.getLatestForCommunity.mockResolvedValue(null);
    
    await communityController.getWeather(mockRequest, mockResponse);
    
    expect(Weather.getLatestForCommunity).toHaveBeenCalledWith('1');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      message: 'Weather data not found' 
    });
  });
});
