import  queries  from './queries.js';

const typeDefs = `
scalar DateTime

type Category {
  category_id: Int
  category_name: String
}

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
  rental_rate: Float
  length: Int
  duration: Int
  store_id: Int
  inventory_id: Int
  address: String
  description: String
}


type Rental {
  title: String
  rental_date: String
  return_date: String
  amount: Float
  category: String
  rental_rate: Float
  length: Int
  duration: Int

  description: String
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
  actors: [Actor!]!
  films: [Film!]!
  categories: [Category!]!
  paginatedFilms(pageNumber: Int!, pageSize: Int!, filmTitle: String, category: String, orderByAttribute: String): PaginatedFilm
  actorsFromFilm(filmName: String!): [Actor!]
  pastRentals(customer_id: Int!, category: String): [Rental!]
  activeRentals(customer_id: Int!, orderByAttribute: String): [Rental!]
  storesWithSelectedFilmAndNumCopies(film_title: String!): [Store!]
}

type Mutation {
  insertRent(film_title: String!, store_id: Int!, customer_id: Int, rental_date: String!): Int
}
`;


const resolvers = {
  Query: {
    films: (parent, args, contextValue, info) => {
      return queries.getFilms();
    },
    categories: (parent, args, contextValue, info) => {
      return queries.getCategories();
    },
    paginatedFilms: (parent, args, contextValue, info) => {
      const pageNumber = args.pageNumber;
      const pageSize = args.pageSize;
      let category = args.category;
      let filmTitle = args.filmTitle;
      let orderByAttribute = args.orderByAttribute;

      if(!orderByAttribute){
        orderByAttribute = 'F.title';
      }

      if (!filmTitle) {
        filmTitle = '';
      }

      if(!category){
        category = '';
      }

      return queries.getPaginatedFilms(pageNumber, pageSize, filmTitle, category, orderByAttribute);
    },
    actorsFromFilm: (parent, args, contextValue, info) => {
      const filmName = args.filmName;
      return queries.getActorFromSpecificFilm(filmName);
    },
    pastRentals: (parent, args, contextValue, info) => {
      const customer_id = args.customer_id;
      let category = args.category;
      if (!category)
        category = 'F.title';

      return queries.getPastRentals(customer_id, category);
    },
    activeRentals: (parent, args, contextValue, info) => {
      const customer_id = args.customer_id;
      let order_by_attribute = args.orderByAttribute;
      if (!order_by_attribute || order_by_attribute === '')
        order_by_attribute = 'F.title';

      return queries.getActiveRentals(customer_id, order_by_attribute);
    },
    storesWithSelectedFilmAndNumCopies: (parent, args, contextValue, info) => {
      const film_title = args.film_title;
      return queries.storesWithSelectedFilmAndNumCopies(film_title);
    }
  },
  Mutation: {
    insertRent: (parent, args, contextValue, info) => {
      const film_title = args.film_title;
      const store_id = args.store_id;
      let customer_id = args.customer_id;
      const rental_date = args.rental_date;

      if(!args.customer_id){
        customer_id = contextValue.user.user.cId;
      }

      console.log("insertRent -  rental_date: ", rental_date);

      return queries.insertNewRent(film_title, store_id, customer_id, rental_date);
    }
  }
};

export { typeDefs, resolvers };
