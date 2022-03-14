import { withApollo as createWithApollo } from "next-apollo";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { getAccessToken } from "./accessToken";
import Router from "next/router";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (message.includes("not authenticated")) {
        Router.replace("/login");
      } else if (message.includes("not admin")) {
        Router.replace("/");
      } else {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      }
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }: any) => ({
    headers: {
      authorization: `bearer ${getAccessToken()}`,
      ...headers,
    },
  }));
  return forward(operation);
});

const createClient = new ApolloClient({
  credentials: "include",
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export const withApollo = createWithApollo(createClient);
