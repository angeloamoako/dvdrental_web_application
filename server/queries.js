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
      reject(error);
    }
    else{
      let actors =  results.rows.map(row => row.first_name);
      response.status(200).json(actors);
    }
  })
}

module.exports = {
  getActors,
  pool,
}
