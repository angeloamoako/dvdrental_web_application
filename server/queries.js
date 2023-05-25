const {response} = require("express");
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dvdrental',
  password: 'admin',
  port: '5432',
})


// test
const getActors = (request, response) => {
  pool.query('SELECT first_name FROM actor LIMIT 5', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getActors,
}
