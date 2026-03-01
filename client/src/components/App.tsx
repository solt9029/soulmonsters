import { useEffect, useReducer } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Rule from '../pages/Rule';
import Terms from '../pages/Terms';
import NotFound from '../pages/NotFound';
import Index from '../pages/Index';
import Deck from '../pages/Deck';
import PrivateRoute from './PrivateRoute';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ID_TOKEN } from '../constants/local-storage-keys';
import { set, rm } from 'lockr';
import Game from '../pages/Game';
import Games from '../pages/Games';
import AppState from '../models/AppState';
import reducer from '../reducer';
import { AppContext } from '../contexts/AppContext';

export default function App() {
  const [state, dispatch] = useReducer(reducer, new AppState());
  const isGamePage = !!useRouteMatch({ path: '/games/:id', exact: true });

  // componentDidMount
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        dispatch({
          type: 'SET_USER',
          payload: state.user.doneLogin(firebaseUser),
        });
        const idToken = await firebaseUser.getIdToken(true);
        set(ID_TOKEN, idToken);
        return;
      }
      rm(ID_TOKEN);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {!isGamePage && <Navbar />}
      <Switch>
        <Route exact path="/" component={Index} />
        <PrivateRoute exact path="/decks" component={Deck} />
        <PrivateRoute exact path="/decks/:id" component={Deck} />
        <PrivateRoute exact path="/games" component={Games} />
        <PrivateRoute exact path="/games/:id" component={Game} />
        <Route exact path="/rule" component={Rule} />
        <Route exact path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </AppContext.Provider>
  );
}
