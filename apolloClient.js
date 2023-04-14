import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { ApolloLink, concat } from "apollo-link";

export function getHeaders() {
   // HTTP connection to the API
   const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'https://service-booking.onrender.com/graphql',
    // uri: 'http://127.0.0.1:3000/graphql',
    headers: {
      Accept: 'application/json'
    }
  })


  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
    return forward(operation);
  });

  // Cache implementation
  const cache = new InMemoryCache()

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache,
    defaultOptions: {
      query: {
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  })

  return { apolloClient }
}