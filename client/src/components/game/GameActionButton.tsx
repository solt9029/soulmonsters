import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import styled from 'styled-components';
import gameActionNames from '../../constants/game-action-names';
import {
  ActionType,
  type GameCardFragment,
} from '../../graphql/generated/graphql-client';
import { useDispatchGameActionMutation } from '../../hooks/useDispatchGameActionMutation';

const StyledButton = styled.button`
  background: rgba(180, 140, 30, 0.08);
  border: 1px solid rgba(180, 140, 30, 0.5);
  border-radius: 4px;
  color: #d4bc7a;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
  font-family: inherit;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(180, 140, 30, 0.2);
    border-color: rgba(220, 170, 40, 0.85);
    color: #f2c84b;
    box-shadow: 0 0 10px rgba(180, 140, 30, 0.35);
  }

  &:active:not(:disabled) {
    background: rgba(180, 140, 30, 0.3);
    box-shadow: 0 0 14px rgba(180, 140, 30, 0.5);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
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
    <StyledButton onClick={handleClick} disabled={loading}>
      {gameActionNames[type]}
    </StyledButton>
  );
}
