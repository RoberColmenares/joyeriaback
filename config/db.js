const { Pool } = require("pg");
require("dotenv").config(); // Si vas a usar variables de entorno

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;