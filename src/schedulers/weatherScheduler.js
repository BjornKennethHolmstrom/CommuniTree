const schedule = require('node-schedule');
const weatherService = require('../services/weatherService');

function scheduleWeatherUpdates() {
  // Run every hour during the day (6 AM to 10 PM)
  schedule.scheduleJob('0 6-22 * * *', function() {
    weatherService.updateWeather();
  });

  // Run every two hours during the night (12 AM to 4 AM)
  schedule.scheduleJob('0 0,2,4 * * *', function() {
    weatherService.updateWeather();
  });
}

module.exports = scheduleWeatherUpdates;
