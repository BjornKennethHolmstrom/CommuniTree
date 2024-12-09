// tests/integration/weatherAPI.test.js
const request = require('supertest');
const app = require('../../server');

describe('Weather API', () => {
  test('GET /api/communities/:id/weather should return weather data', async () => {
    const mockWeatherData = {
      community_id: 1,
      id: 1,
      temperature: 20,
      weather: 'Clear',
      timestamp: expect.any(String) // Changed from Date to String expectation
    };

    const response = await request(app)
      .get('/api/communities/1/weather')
      .set('x-auth-token', 'test-token');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(mockWeatherData);
  });
});
