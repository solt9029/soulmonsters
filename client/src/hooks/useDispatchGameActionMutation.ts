import { AppContext } from './../components/App';
import { useContext } from 'react';
import { GameDocument } from './../graphql/generated/graphql-client';
import { useDispatchGameActionMutation as _useDispatchGameActionMutation } from '../graphql/generated/graphql-client';

export function useDispatchGameActionMutation(gameId: number) {
  const { dispatch } = useContext(AppContext);

  return _useDispatchGameActionMutation({
    refetchQueries: [{ query: GameDocument, variables: { id: gameId } }],
    onCompleted: () => {},
    onError: (error) => {
      dispatch({
        type: 'SET_ERROR',
        payload: { name: 'dispatchGameActionError', error },
      });
    },
  });
}
