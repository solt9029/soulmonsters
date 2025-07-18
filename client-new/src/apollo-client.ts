import { ID_TOKEN } from './constants/local-storage-keys';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { get } from 'lockr';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_HTTP_LINK_URI,
});

const authLink = setContext(async (_, { headers }) => ({
  headers: { ...headers, authorization: get(ID_TOKEN) },
}));

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
