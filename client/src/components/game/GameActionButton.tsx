import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import { AppContext } from '../../contexts/AppContext';
import styled from 'styled-components';
import gameActionNames from '../../constants/game-action-names';
import {
  ActionType,
  type GameCardFragment,
} from '../../graphql/generated/graphql-client';
import { useDispatchGameActionMutation } from '../../hooks/useDispatchGameActionMutation';

const StyledButton = styled(Button)`
  width: 100%;
  & + & {
    margin-left: 10px;
  }
`;

export type GameActionButtonProps = {
  type: ActionType;
  gameCard?: GameCardFragment;
};

export default function GameActionButton({
  type,
  gameCard,
}: GameActionButtonProps) {
  const {
    state: { actionStatus },
    dispatch,
  } = useContext(AppContext);

  const { id } = useParams<{ id: string }>();
  const gameId = parseInt(id);

  const [dispatchGameAction, { loading }] =
    useDispatchGameActionMutation(gameId);

  const handleClick = async () => {
    dispatch({ type: 'RESET_ERROR', payload: 'dispatchGameActionError' });

    const gameCardId = gameCard?.id;
    const newActionStatus = actionStatus.start({ type, gameCardId });
    if (newActionStatus.isCompleted()) {
      await dispatchGameAction({
        variables: {
          id: gameId,
          data: { type, payload: { gameCardId } },
        },
      });
    } else {
      await dispatch({
        type: 'SET_ACTION_STATUS',
        payload: newActionStatus,
      });
    }
    await dispatch({ type: 'CLOSE_GAME_MODAL' });
  };

  return (
    <StyledButton color="primary" onClick={handleClick} disabled={loading}>
      {gameActionNames[type]}
    </StyledButton>
  );
}
