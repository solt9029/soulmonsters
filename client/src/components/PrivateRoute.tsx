import { Route, type RouteProps, Redirect } from 'react-router-dom';
import { ID_TOKEN } from '../constants/local-storage-keys';
import { get } from 'lockr';

export default function PrivateRoute(props: RouteProps) {
  if (get(ID_TOKEN) === undefined) {
    return <Route {...props} component={() => <Redirect to="/" />} />;
  }
  return <Route {...props} />;
}
