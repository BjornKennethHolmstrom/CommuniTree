const request = require('supertest');
const app = require('../../server');
const Weather = require('../../src/models/weather');
const auth = require('../../src/middleware/auth');

jest.mock('../../src/middleware/auth');
jest.mock('../../src/models/weather', () => ({
  getLatestForCommunity: jest.fn(),
}));

describe('Weather API', () => {
  beforeEach(() => {
    auth.mockImplementation((req, res, next) => next());
  });

  test('GET /api/communities/:id/weather should return weather data', async () => {
    const mockWeatherData = {
      id: 1,
      community_id: 1,
      weather: 'Clear',
      temperature: 20,
      timestamp: new Date()
    };
    Weather.getLatestForCommunity.mockResolvedValue(mockWeatherData);

    const response = await request(app)
      .get('/api/communities/1/weather');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockWeatherData);
  });

  test('GET /api/communities/:id/weather should return 404 if no weather data found', async () => {
    Weather.getLatestForCommunity.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/communities/1/weather');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Weather data not found' });
  });
});
