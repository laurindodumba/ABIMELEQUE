const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

let rawUrl = process.env.DATABASE_POSTGRES_URL || process.env.DATABASE_URL || '';
if (rawUrl.includes('?')) {
  rawUrl = rawUrl.split('?')[0];
}

const pool = new Pool({
  connectionString: rawUrl,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('Conectado à Base de Dados PostgreSQL!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
