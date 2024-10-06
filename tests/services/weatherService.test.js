const weatherService = require('../../src/services/weatherService');
const Community = require('../../src/models/community');
const Weather = require('../../src/models/weather');
const axios = require('axios');

jest.mock('axios');
jest.mock('../../models/community');
jest.mock('../../models/weather');

describe('Weather Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchWeatherData should return weather data', async () => {
    const mockWeatherData = {
      data: {
        weather: [{ main: 'Clear' }],
        main: { temp: 20 }
      }
    };
    axios.get.mockResolvedValue(mockWeatherData);

    const result = await weatherService.fetchWeatherData(0, 0);
    expect(result).toEqual({ weather: 'Clear', temperature: 20 });
  });

  test('updateWeather should update weather for all communities needing update', async () => {
    const mockCommunities = [
      { id: 1, latitude: 0, longitude: 0 },
      { id: 2, latitude: 1, longitude: 1 }
    ];
    Community.getCommunitiesForWeatherUpdate.mockResolvedValue(mockCommunities);

    const mockWeatherData = { weather: 'Clear', temperature: 20 };
    weatherService.fetchWeatherData = jest.fn().mockResolvedValue(mockWeatherData);

    await weatherService.updateWeather();

    expect(Community.updateWeather).toHaveBeenCalledTimes(2);
    expect(Weather.create).toHaveBeenCalledTimes(2);
  });
});
