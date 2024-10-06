const db = require('../../config/database');

const Weather = {
  async create(communityId, weatherData) {
    const query = `
      INSERT INTO weather_history (community_id, weather, temperature, timestamp)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [communityId, weatherData.weather, weatherData.temperature];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async getLatestForCommunity(communityId) {
    const query = `
      SELECT * FROM weather_history
      WHERE community_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const result = await db.query(query, [communityId]);
    return result.rows[0];
  }
};

module.exports = Weather;
