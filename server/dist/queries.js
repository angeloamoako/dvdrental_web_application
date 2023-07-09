// prende le variabili d'ambiente definite nel file  ".env"
import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
const poolDbUsers = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_UTENTI,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
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
    return new Promise((resolve, reject) => {
        pool.query(q1, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                let output = results.rows;
                resolve(output);
            }
        });
    });
};
const getPaginatedFilms = (pageNumber, pageSize, filmTitle, category) => {
    /* Funzione che restituisce un elenco di film paginato */
    const q1 = `SELECT DISTINCT F.title, F.release_year, F.rating, C.name AS genre, L.name AS language, F.rental_rate, F.length,
                              F.rental_duration  AS duration, F.description
                     FROM film F JOIN inventory I ON F.film_id = I.film_id
                        JOIN film_category FC ON F.film_id = FC.film_id
                        JOIN rental R ON R.inventory_id = I.inventory_id
                        JOIN  category C ON FC.category_id = C.category_id
                        JOIN language L ON F.language_id = L.language_id
                    WHERE I.inventory_id NOT IN (
                      SELECT inventory_id
                      FROM rental
                      WHERE return_date IS NULL
                    ) AND F.title ILIKE $1 AND C.name ILIKE $2
                    ORDER BY F.title`;
    return new Promise((resolve, reject) => {
        pool.query(q1, [`%${filmTitle}%`, `%${category}%`], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                /* trovo la pagina richiesta */
                let output = results.rows;
                // il paginator sul front-end è indicizzato a partire da 0, quindi non devo sottrarre 1 a pageNumber
                let start = pageSize * pageNumber;
                let end = start + pageSize;
                console.log(`page-number: ${pageNumber}`);
                console.log(`Slicing start: ${start},  end:${end}`);
                console.log(`total_results: ${results.rows.length}`);
                console.log("Film title: ", filmTitle, " category: ", category);
                resolve({ filmList: output.slice(start, end), totalResults: results.rows.length });
            }
        });
    });
};
const getActorFromSpecificFilm = (filmName) => {
    const q = "SELECT A.actor_id, A.first_name, A.last_name " +
        "FROM actor A JOIN film_actor FA ON A.actor_id = FA.actor_id " +
        " JOIN film F ON FA.film_id = F.film_id " +
        "WHERE F.title = $1";
    return new Promise((resolve, reject) => {
        pool.query(q, [filmName], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                let output = results.rows;
                resolve(output);
            }
        });
    });
};
const getPastRentals = (customer_id, category) => {
    /* Query che recupera i film noleggiati in passato dall'utente specificato  */
    const q = `SELECT F.title, R.rental_date, F.description, R.return_date,
 P.amount, CAT.name AS category, F.rental_duration  AS duration, F.length, F.rental_rate
        FROM film F JOIN inventory I ON F.film_id = I.film_id
            JOIN film_category FC ON FC.film_id = F.film_id
            JOIN category CAT ON CAT.category_id = FC.category_id
            JOIN rental R ON R.inventory_id = I.inventory_id
            JOIN customer C ON C.customer_id = R.customer_id
            JOIN payment P ON P.rental_id = R.rental_id
        WHERE C.customer_id = $1 AND (R.return_date IS NOT NULL)
        ORDER BY ${category}`;
    return new Promise((resolve, reject) => {
        pool.query(q, [customer_id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                let output = results.rows;
                resolve(output);
            }
        });
    });
};
const getActiveRentals = (customer_id) => {
    /* Query che recuepera i film che l'utente specificato sta noleggiando attualmente  */
    const q = `SELECT F.title, F.rental_duration  AS duration, F.length, F.description,
                                        R.rental_date, F.rental_rate
        FROM film F JOIN inventory I ON F.film_id = I.film_id
            JOIN rental R ON R.inventory_id = I.inventory_id
            JOIN customer C ON C.customer_id = R.customer_id
        WHERE C.customer_id = $1 AND (R.return_date IS NULL)`;
    return new Promise((resolve, reject) => {
        pool.query(q, [customer_id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                let output = results.rows;
                console.log("Prima data: ", results.rows[0].rental_date);
                resolve(output);
            }
        });
    });
};
const storesWithSelectedFilmAndNumCopies = (film_title) => {
    /* Restituisce gli store in cui il film richiesto è disponibile */
    const q = `SELECT S.store_id, A.address, COUNT(*) as numero_copie
                                        FROM inventory I JOIN rental R ON R.inventory_id = I.inventory_id
                                          JOIN store S ON S.store_id = I.store_id
                                          JOIN address A ON A.address_id = S.address_id
                                        WHERE (I.inventory_id, R.rental_date) IN (
                                          SELECT I2.inventory_id, MAX(R2.rental_date) AS last_rental
                                          FROM inventory I2 JOIN film F ON I2.film_id = F.film_id
                                            JOIN rental R2 ON I2.inventory_id = R2.inventory_id
                                          WHERE F.title = $1
                                          GROUP BY I2.inventory_id
                                        ) AND R.return_date IS NOT NULL
                                        GROUP BY s.store_id, A.address`;
    return new Promise((resolve, reject) => {
        pool.query(q, [film_title], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                let output = results.rows;
                resolve(output);
            }
        });
    });
};
const storesWithSelectedFilmAvailable = (film_title) => {
    /* Restituisce gli store in cui il film richiesto è disponibile */
    const q = `SELECT DISTINCT S.store_id, A.address
                                        FROM inventory I JOIN rental R ON R.inventory_id = I.inventory_id
                                          JOIN store S ON S.store_id = I.store_id
                                          JOIN address A ON A.address_id = S.address_id
                                        WHERE (I.inventory_id, R.rental_date) IN (
                                          SELECT I2.inventory_id, MAX(R2.rental_date) AS last_rental
                                          FROM inventory I2 JOIN film F ON I2.film_id = F.film_id
                                            JOIN rental R2 ON I2.inventory_id = R2.inventory_id
                                          WHERE F.title = $1
                                          GROUP BY I2.inventory_id
                                        ) AND R.return_date IS NOT NULL;`;
    return new Promise((resolve, reject) => {
        pool.query(q, [film_title], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                let output = results.rows;
                resolve(output);
            }
        });
    });
};
const getStaffForStore = (store_id) => {
    /* restituisce lo staff_id del gestore dello store selezionato */
    const q = `SELECT staff_id
                                   FROM staff
                                   WHERE store_id = $1`;
    return new Promise((resolve, reject) => {
        pool.query(q, [store_id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                let output = results.rows;
                resolve(output);
            }
        });
    });
};
const insertNewRent = (film_title, store_id, customer_id, rental_date) => {
    /* Recupera un inventory_id associato al film ed allo store passato in input. */
    const q1 = `SELECT I.inventory_id
                                                FROM film F JOIN inventory I on F.film_id = I.film_id
                                                    JOIN store S on S.store_id = I.store_id
                                                    JOIN rental R ON I.inventory_id = R.inventory_id
                                                WHERE F.title = $1 AND S.store_id = $2 AND I.inventory_id NOT IN (
                                                    SELECT inventory_id
                                                    FROM rental
                                                    WHERE return_date IS NULL
                                                )`;
    return new Promise((resolve, reject) => {
        pool.query(q1, [film_title, store_id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                const inventory_id = results.rows[0].inventory_id;
                console.log("Inventory_id: ", inventory_id);
                var staff_id;
                getStaffForStore(store_id).then((queryRes) => {
                    staff_id = queryRes[0].staff_id;
                    const insertQuery = `
                             INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id)
                             VALUES ($1, $2, $3, $4)`;
                    pool.query(insertQuery, [rental_date, inventory_id, customer_id, staff_id], (error, results) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            const rowsAdded = results.rowCount;
                            resolve(rowsAdded);
                        }
                    });
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    });
};
export default {
    getFilms,
    getPaginatedFilms,
    getActorFromSpecificFilm,
    getPastRentals,
    getActiveRentals,
    storesWithSelectedFilmAndNumCopies,
    storesWithSelectedFilmAvailable,
    getStaffForStore,
    insertNewRent,
    poolDbUsers,
};
//# sourceMappingURL=queries.js.map