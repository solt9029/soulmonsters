import { ID_TOKEN } from './constants/local-storage-keys';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { get } from 'lockr';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_HTTP_LINK_URI,
});

const authLink = setContext(async (_, { headers }) => ({
  headers: { ...headers, authorization: get(ID_TOKEN) },
}));

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;
