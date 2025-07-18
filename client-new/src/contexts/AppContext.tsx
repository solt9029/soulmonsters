import React, { createContext } from 'react';
import AppState from '../models/AppState';
import { type default as Action } from '../actions';

export interface AppContextInterface {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const AppContext = createContext<AppContextInterface>({
  state: new AppState(),
  dispatch: () => {},
});
