const axios = require('axios');
const Community = require('../models/community');
const Weather = require('../models/weather');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

const weatherService = {
  async updateWeather() {
    const communities = await Community.getCommunitiesForWeatherUpdate();
    for (const community of communities) {
      try {
        const weatherData = await this.fetchWeatherData(community.latitude, community.longitude);
        await Community.updateWeather(community.id, weatherData);
        await Weather.create(community.id, weatherData);
      } catch (error) {
        console.error(`Error updating weather for community ${community.id}:`, error);
      }
    }
  },

  async fetchWeatherData(lat, lon) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric'
        }
      });
      return {
        weather: response.data.weather[0].main,
        temperature: response.data.main.temp
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
};

module.exports = weatherService;
