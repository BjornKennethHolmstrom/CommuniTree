// scripts/createAdminUser.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdminUser(username, name, email, password) {
  const client = await pool.connect();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, name, email, password, role)
      VALUES ($1, $2, $3, $4, 'admin')
      RETURNING id, username, name, email, role
    `;
    const values = [username, name, email, hashedPassword];
    
    console.log('Executing query:', query);
    console.log('With values:', values.map((v, i) => i === 3 ? '[HASHED_PASSWORD]' : v));

    const result = await client.query(query, values);
    console.log('Admin user created successfully:', result.rows[0]);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Usage
createAdminUser('bjornkennethholmstrom', 'Björn Kenneth Holmström', 'bjorn.kenneth.holmstrom@gmail.com', 'YggDr@$i1')
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
