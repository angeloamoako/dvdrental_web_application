import  queries  from './queries.js';

const typeDefs = `
scalar Date

type Actor{
  actor_id: Int
  first_name: String
  last_name: String
}

type Film {
  title: String
  release_year: String
  rating: String
  genre: String
  language: String
  cost: Float
  length: Int
  duration: Int
  store_id: Int
  inventory_id: Int
  address: String
  description: String
}


type Rental {
  title: String
  rental_date: Date
  return_date: Date
  amount: Float
}

type Store {
  store_id: Int
  address: String
  numero_copie: Int
}

type PaginatedFilm {
  filmList: [Film]
  totalResults: Int
}

type Query {
  actors: [Actor]
  films: [Film]
  paginatedFilms(pageNumber: Int, pageSize: Int, filmTitle: String, category: String): PaginatedFilm
  actorsFromFilm(filmName: String): [Actor]
  pastRentals(customer_id: Int): [Rental]
  activeRentals(customer_id: Int): [Rental]
  storesWithSelectedFilmAndNumCopies(film_title: String): [Store]
  storesWithSelectedFilmAvailable(film_title: String): [Store]
}

type Mutation {
  insertRent(film_title: String, store_id: Int, customer_id: Int, rental_date: Date): Int
}
`;


const resolvers = {
  Query: {
    films: (parent, args, contextValue, info) => {
      console.log("ContextValue: ", contextValue);
      return queries.getFilms();
    },
    paginatedFilms: (parent, args, contextValue, info) => {
      const pageNumber = args.pageNumber;
      const pageSize = args.pageSize;
      let category = args.category;
      let filmTitle = args.filmTitle;

      if (!filmTitle){
        filmTitle = '';
      }

      if(!category){
        category = '';
      }

      return queries.getPaginatedFilms(pageNumber, pageSize, filmTitle, category);
    },
    actorsFromFilm: (parent, args, contextValue, info) => {
      const filmName = args.filmName;
      return queries.getActorFromSpecificFilm(filmName);
    },
    pastRentals: (parent, args, contextValue, info) => {
      const customer_id = args.customer_id;
      return queries.getPastRentals(customer_id);
    },
    activeRentals: (parent, args, contextValue, info) => {
      const customer_id = args.customer_id;
      return queries.getActiveRentals(customer_id);
    },
    storesWithSelectedFilmAndNumCopies: (parent, args, contextValue, info) => {
      const film_title = args.film_title;
      return queries.storesWithSelectedFilmAndNumCopies(film_title);
    },
    storesWithSelectedFilmAvailable: (parent, args, contextValue, info) => {
      const film_title = args.film_title;
      return queries.storesWithSelectedFilmAvailable(film_title);
    }
  },
  Mutation: {
    insertRent: (parent, args, contextValue, info) => {
      const film_title = args.film_title;
      const store_id = args.store_id;
      let customer_id = args.customer_id;

      if(!args.customer_id){
        customer_id = contextValue.user.user.cId;
      }
      const rental_date = args.rental_date;
      console.log(`insertRent film_title: ${film_title}\nstore_id: ${store_id}\ncustomer_id: ${customer_id}\nrental_date: ${rental_date}  `);

      return queries.insertNewRent(film_title, store_id, customer_id, rental_date);
    }
  }
};

export { typeDefs, resolvers };
