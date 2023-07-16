import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { setContext } from '@apollo/client/link/context';
import { ApolloClientOptions, InMemoryCache, createHttpLink } from '@apollo/client/core';

const uri = 'http://localhost:4000/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(): ApolloClientOptions<any> {
  const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem('authToken');

    if (token) {
      return {
        headers: {
          ...headers,
          Authorization: token,
        },
      };
    }

    return {
      headers,
    };
  });

  return {
    link: authLink.concat(createHttpLink({uri: uri})),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,

    },
  ],
})
export class GraphQLModule {}
