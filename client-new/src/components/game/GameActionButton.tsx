import { useContext } from 'react';
import { Button } from 'reactstrap';
import { AppContext } from '../../contexts/AppContext';
import styled from 'styled-components';
import gameActionNames from '../../constants/game-action-names';
import {
  useActiveGameIdQuery,
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

  const activeGameIdQueryResult = useActiveGameIdQuery();
  const activeGameId = activeGameIdQueryResult.data?.activeGameId || 1;

  const [dispatchGameAction] = useDispatchGameActionMutation(activeGameId);

  const handleClick = async () => {
    const gameCardId = gameCard?.id;
    const newActionStatus = actionStatus.start({ type, gameCardId });
    if (newActionStatus.isCompleted()) {
      await dispatchGameAction({
        variables: {
          id: activeGameId,
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
    <StyledButton color="primary" onClick={handleClick}>
      {gameActionNames[type]}
    </StyledButton>
  );
}
