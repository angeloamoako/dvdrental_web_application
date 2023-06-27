import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import { GraphQLError } from 'graphql';
import { ApolloServer, gql } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema.js';
import usersRouter from './users.js';

const SECRET_KEY = process.env.SECRET_PASSWORD;

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, SECRET_KEY);
    }
    return null;
  } catch (error) {
    return null;
  }
};

async function startApolloServer() {
  //const server = new ApolloServer({ typeDefs, resolvers });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUser(token);

      if (!user) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      }
      
      /* se l'utente fornisce il token allora aggiungo  le sue info all'oggetto
          context, che è disponibile  nei resolver */
      return { user };
    },
  });


  await server.start();

  const app = express();
  app.use(express.urlencoded({extended: true})); //to parse URL encoded data
  app.use(express.json()); //to parse json data
  app.use(cors()); //to allow cors

  server.applyMiddleware({ app });

  //app.use("/users", usersRouter);
  app.use('/users', usersRouter);

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startApolloServer().catch((error) => {
  console.error('Failed to start Apollo server:', error);
});
