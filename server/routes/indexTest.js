const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import { ApolloServer } from '@apollo/server';

const db = require("../queries");
var router = express.Router();
const {graphqlHTTP} = require('express-graphql')

// Construct a schema, using GraphQL schema language
const schema = `
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
  }

  type Query {
    hello: String
    actors: [Actor]
    films: [Film]
    actorsFromFilm: [Actor]
  }

`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',

  },

  actors: () => {
    return db.getActors();
  },

  films: () => {
    return db.getFilms();
  },

  actorsFromFilm: () => {
    return db.getActorFromSpecificFilm();
  }

};



const server = new ApolloServer({ schema, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
