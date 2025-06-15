import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { ID_TOKEN } from '../constants/local-storage-keys';
import Lockr from 'lockr';

export default function PrivateRoute(props: RouteProps) {
  if (Lockr.get(ID_TOKEN) === undefined) {
    return <Route {...props} component={() => <Redirect to="/" />} />;
  }
  return <Route {...props} />;
}
