const {response} = require("express");
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dvdrental',
  password: 'postgres',
  port: '5432',
})

const poolDbUsers = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'utenti',
  password: 'postgres',
  port: '5432',
})

// test
const getActors = (request, response) => {
  /* La promise gestisce la chiamata asincrona a conn.query()
   in pratica aspetta che arrivi il risultato della query dal database e se questa va a buon fine viene
   chiamata la funzione di call-back resolve a cui passo il risultato della query.
   Se invece la query da un qualsiasi tipo di problema viene invocata la funzione reject. */

  return new Promise((resolve, reject) => {
    pool.query("SELECT actor_id, first_name, last_name  FROM actor LIMIT 5", (error, results) => {
      if (error) {
        reject(error);
      } else {
        let output = results.rows;
        resolve(output);
      }
    });
  })
}


const getFilms = (request, response) => {
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

// TROVARE SOLUZIONE PER PASSARE DA CLIENT ID O TITLE PER LA RICERCA DEGLI ATTORI DI QUEL PRECISO FILM
const getActorFromSpecificFilm = (request, response) =>{
  const q = "SELECT A.actor_id, A.first_name, A.last_name" +
    "FROM actor A JOIN film_actor FA ON A.actor_id = FA.actor_id" +
    "JOIN film F ON FA.film_id = F.film_id" +
    "WHERE F.film_id = 1";

  return new Promise((resolve, reject)=>{
    pool.query(q, (error, results) => {
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
  getActors,
  getFilms,
  getActorFromSpecificFilm,
  pool,
  poolDbUsers,
}
