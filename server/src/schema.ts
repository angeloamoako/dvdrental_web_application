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
  inventory_id: Int
}

type PaginatedFilm{
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
  storesWithSelectedFilm(film_title: String): [Store]
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
    storesWithSelectedFilm: (parent, args, contextValue, info) => {
      const film_title = args.film_title;
      return queries.storesWithSelectedFilm(film_title);
    }
  },
};

export { typeDefs, resolvers };
