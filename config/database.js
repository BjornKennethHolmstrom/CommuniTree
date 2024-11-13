const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Wrapper for database queries
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const start = Date.now();
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', {
      text,
      params,
      duration,
      rows: res.rowCount,
    });
    return res;
  } catch (err) {
    console.error('Query error:', { text, params, error: err });
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  pool
};
