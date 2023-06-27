// prende le variabili d'ambiente definite nel file  ".env"
require('dotenv').config();

const { response} = require("express");
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

const poolDbUsers = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_UTENTI,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})


/*
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dvdrental',
  password: 'postgres',
  port: '5432'
})

const poolDbUsers = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'utenti',
    password: 'postgres',
    port: '5432'
  })
*/

const getFilms = () => {

  const q1 = `SELECT DISTINCT F.title, F.release_year, F.rating, C.name AS genre, L.name AS language, F.rental_rate AS cost, F.length, F.rental_duration  AS duration
                     FROM film F JOIN inventory I ON F.film_id = I.film_id
                        JOIN film_category FC ON F.film_id = FC.film_id
                        JOIN rental R ON R.inventory_id = I.inventory_id
                        JOIN  category C ON FC.category_id = C.category_id
                        JOIN language L ON F.language_id = L.language_id
                    WHERE I.inventory_id NOT IN (
                      SELECT inventory_id
                      FROM rental
                      WHERE return_date IS NULL
                    )
                    ORDER BY F.title`;

  return new Promise((resolve, reject) =>{
    pool.query(q1, (error, results) =>{
      if (error){
        reject(error);
      } else{
        let output = results.rows;
        resolve(output);
      }
    });
  })
}


const getSpecificFilm = (request) => {
  const q = "SELECT F.title, F.release_year, F.rating, C.name AS genre, L.name AS language, F.rental_rate AS cost " +
    "FROM film F JOIN film_category FC ON F.film_id = FC.film_id " +
    "JOIN  category C ON FC.category_id = C.category_id " +
    "JOIN language L ON F.language_id = L.language_id";

  return new Promise((resolve, reject) =>{
    pool.query(q, (error, results) =>{
      if (error){
        reject(error);
      } else{
        let output = results.rows;
        resolve(output);
      }
    });
  })
}

const getActorFromSpecificFilm = (request) =>{
  const q = "SELECT A.actor_id, A.first_name, A.last_name " +
    "FROM actor A JOIN film_actor FA ON A.actor_id = FA.actor_id " +
    " JOIN film F ON FA.film_id = F.film_id " +
    "WHERE F.title = $1";

  return new Promise((resolve, reject)=>{
    pool.query(q, [request.filmName], (error, results) => {
      if(error){
        reject(error);
      }else{
        let output = results.rows;
        resolve(output);
      }
    });
  })
}

const getPastRentals = (request) => {
  /* Query che recuepera i film noleggiati in passato dall'utente specificato  */
  q = `SELECT F.title, R.rental_date, R.return_date, P.amount
        FROM film F JOIN inventory I ON F.film_id = I.film_id
            JOIN rental R ON R.inventory_id = I.inventory_id
            JOIN customer C ON C.customer_id = R.customer_id
            JOIN payment P ON P.rental_id = R.rental_id
        WHERE C.customer_id = $1 AND (R.return_date IS NOT NULL)`;


  return new Promise((resolve, reject)=>{
    pool.query(q, [request.customer_id], (error, results) => {
      if(error){
        reject(error);
      }else{
        let output = results.rows;
        resolve(output);
      }
    });
  })
}



const getActiveRentals = (request) => {
  /* Query che recuepera i film che l'utente specificato sta noleggiando attualmente  */
  q = `SELECT F.title
        FROM film F JOIN inventory I ON F.film_id = I.film_id
            JOIN rental R ON R.inventory_id = I.inventory_id
            JOIN customer C ON C.customer_id = R.customer_id
        WHERE C.customer_id = $1 AND (R.return_date IS NULL)`;


  return new Promise((resolve, reject)=>{
    pool.query(q, [request.customer_id], (error, results) => {
      if(error){
        reject(error);
      }else{
        let output = results.rows;
        resolve(output);
      }
    });
  })
}

const storesWithSelectedFilm = (request) => {

  /* Restituisce gli store in cui il film richiesto è disponibile */

  /* L'alternativa a questa query sarebbe stata ritornare per ogni store il numero di copie disponibili del film
     in quel caso il problema sarebbe stato recuperare l'inventory_id nel momento in cui devo gestire
     la prenotazione di un film.
   */
  const q = `SELECT S.store_id, A.address, I.inventory_id
                    FROM film F JOIN inventory I on F.film_id = I.film_id
                        JOIN store S on S.store_id = I.store_id
                        JOIN address A on A.address_id = S.address_id
                    WHERE F.title = $1 AND F.film_id in (
                      SELECT film_id
                      FROM inventory i
                      WHERE inventory_id NOT IN (
                        SELECT inventory_id
                        FROM rental R
                        WHERE return_date is NULL
                      )
                    )`;

  return new Promise((resolve, reject)=>{
    pool.query(q, [request.film_title], (error, results) => {
      if(error){
        reject(error);
      }else{
        let output = results.rows;
        resolve(output);
      }
    });
  })
}

module.exports = {
  getFilms,
  getSpecificFilm,
  getActorFromSpecificFilm,
  getPastRentals,
  getActiveRentals,
  storesWithSelectedFilm,
  poolDbUsers,
}
