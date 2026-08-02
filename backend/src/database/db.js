const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' }); // Ajuste conforme onde fica o .env

const pool = new Pool({
  connectionString: process.env.DATABASE_POSTGRES_URL_NON_POOLING || process.env.DATABASE_POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('Conectado à Base de Dados PostgreSQL!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
