// init-database.js
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
  console.log('Initializing database...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const sqlPath = path.join(__dirname, 'database.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('Database initialized successfully');
    console.log('Demo users: client@demo.com / professional@demo.com');
    console.log('Password for both: 123456');
    
  } catch (error) {
    console.error('Database initialization error:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('Tables already exist, skipping initialization');
    } else {
      throw error;
    }
    
  } finally {
    await pool.end();
  }
}


if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;