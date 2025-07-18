import { getAuth, signInWithPopup, TwitterAuthProvider, signOut } from 'firebase/auth';
import { type Dispatch } from 'react';
import { type default as Action } from '.';
import { type default as AppState } from '../models/AppState';

export const login = async (
  dispatch: Dispatch<Action>,
  { user }: Pick<AppState, 'user'>
) => {
  dispatch({ type: 'SET_USER', payload: user.startLoading() });
  try {
    const auth = getAuth();
    const data = await signInWithPopup(auth, new TwitterAuthProvider());
    if (data.user === null) {
      throw new Error();
    }
    dispatch({ type: 'SET_USER', payload: user.doneLogin(data.user) });
  } catch (error) {
    dispatch({ type: 'SET_USER', payload: user.failedLogin(error) });
  }
};

export const logout = async (
  dispatch: Dispatch<Action>,
  { user }: Pick<AppState, 'user'>
) => {
  dispatch({ type: 'SET_USER', payload: user.startLoading() });
  try {
    const auth = getAuth();
    await signOut(auth);
    dispatch({ type: 'SET_USER', payload: user.doneLogout() });
    // TODO: initialize app state and clear graphql cache here.
  } catch (error) {
    dispatch({ type: 'SET_USER', payload: user.failedLogin(error) });
  }
};
