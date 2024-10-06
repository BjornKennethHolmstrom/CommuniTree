// tests/integration/weatherAPI.test.js

const request = require('supertest');
const app = require('../../server'); // Adjust the path as needed
const Weather = require('../../src/models/weather');

jest.mock('../../src/models/weather');

describe('Weather API', () => {
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
      .get('/api/communities/1/weather')
      .set('Authorization', 'Bearer fake-token'); // You might need to mock authentication

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockWeatherData);
  });

  test('GET /api/communities/:id/weather should return 404 if no weather data found', async () => {
    Weather.getLatestForCommunity.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/communities/1/weather')
      .set('Authorization', 'Bearer fake-token');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Weather data not found' });
  });
});
