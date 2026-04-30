const { Pool } = require('pg')

const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  host: 'database'
})

module.exports = pool