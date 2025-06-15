import React, { useEffect, createContext, useReducer } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Help from '../pages/Help';
import Rule from '../pages/Rule';
import NotFound from '../pages/NotFound';
import Index from '../pages/Index';
import Deck from '../pages/Deck';
import PrivateRoute from './PrivateRoute';
import { auth } from 'firebase';
import { ID_TOKEN } from '../constants/local-storage-keys';
import Lockr from 'lockr';
import Game from '../pages/Game';
import AppState from '../models/AppState';
import reducer from '../reducer';
import Action from '../actions';

export interface AppContextInterface {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const AppContext = createContext<AppContextInterface>({
  state: new AppState(),
  dispatch: () => {},
});

export default function App() {
  const [state, dispatch] = useReducer(reducer, new AppState());

  // componentDidMount
  useEffect(() => {
    auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        dispatch({
          type: 'SET_USER',
          payload: state.user.doneLogin(firebaseUser),
        });
        const idToken = await firebaseUser.getIdToken(true);
        Lockr.set(ID_TOKEN, idToken);
        return;
      }
      Lockr.rm(ID_TOKEN);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Index} />
        <PrivateRoute exact path="/deck" component={Deck} />
        <PrivateRoute exact path="/game" component={Game} />
        <Route exact path="/help" component={Help} />
        <Route exact path="/rule" component={Rule} />
        <Route component={NotFound} />
      </Switch>
    </AppContext.Provider>
  );
}
