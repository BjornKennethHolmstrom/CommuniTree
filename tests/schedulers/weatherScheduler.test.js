const schedule = require('node-schedule');
const weatherService = require('../../src/services/weatherService');
const scheduleWeatherUpdates = require('../../src/schedulers/weatherScheduler');

jest.mock('node-schedule');
jest.mock('../../src/services/weatherService');

describe('Weather Scheduler', () => {
  test('should schedule weather updates', () => {
    scheduleWeatherUpdates();

    expect(schedule.scheduleJob).toHaveBeenCalledTimes(2);
    expect(schedule.scheduleJob.mock.calls[0][0]).toBe('0 6-22 * * *');
    expect(schedule.scheduleJob.mock.calls[1][0]).toBe('0 0,2,4 * * *');
  });

  test('scheduled jobs should call weatherService.updateWeather', () => {
    scheduleWeatherUpdates();

    const daytimeJob = schedule.scheduleJob.mock.calls[0][1];
    const nighttimeJob = schedule.scheduleJob.mock.calls[1][1];

    daytimeJob();
    nighttimeJob();

    expect(weatherService.updateWeather).toHaveBeenCalledTimes(2);
  });
});
