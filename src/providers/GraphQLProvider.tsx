import { ApolloClient, InMemoryCache, ApolloProvider, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createHttpLink } from '@apollo/client/link/http';

// Optimized Apollo Client configuration
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  // Enable HTTP/2 multiplexing
  fetchOptions: {
    mode: 'cors',
  },
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.log(`Network error: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    // Optimize cache with type policies
    typePolicies: {
      Query: {
        fields: {
          feeds: {
            // Enable cursor-based pagination caching
            keyArgs: false,
            merge(existing = { edges: [], pageInfo: {} }, incoming) {
              return {
                ...incoming,
                edges: [...existing.edges, ...incoming.edges],
              };
            },
          },
        },
      },
    },
  }),
  // Performance optimizations
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
