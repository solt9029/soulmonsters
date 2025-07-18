import { useContext } from 'react';
import { Col } from '../../styled/reactstrap';
import styled from 'styled-components';
import {
  type GameUserFragment,
  useActiveGameIdQuery,
} from '../../graphql/generated/graphql-client';
import { AppContext } from '../../contexts/AppContext';
import { findGameUser } from '../../utils/game';
import GameActionButton from './GameActionButton';
import ActionStatus from '../../models/ActionStatus';
import { useDispatchGameActionMutation } from '../../hooks/useDispatchGameActionMutation';

const StyledCol = styled(Col)`
  color: white;
  align-items: center;
  -webkit-align-items: center;
  display: flex;
  overflow-x: auto;
  ::before,
  ::after {
    content: '';
    margin: auto;
  }
`;

const UserLogo = styled.div<{ picture?: string | null }>`
  ${(props) => `background: url('${props.picture}') no-repeat left center;`}
  background-size: contain;
  border-radius: 50%;
  border: none;
  &:focus {
    box-shadow: none;
  }
  &:hover {
    border-color: #eee;
  }
  height: 45px;
  width: 45px;
`;

const UserInfo = styled.div`
  margin-left: 10px;
`;

const UserName = styled.div`
  font-weight: bold;
`;

export type GameUserProps = {
  gameUsers: GameUserFragment[] | undefined;
  isYours: boolean;
};

export default function GameUser({ gameUsers, isYours }: GameUserProps) {
  const {
    state: { user, actionStatus },
    dispatch,
  } = useContext(AppContext);

  const activeGameIdQueryResult = useActiveGameIdQuery();
  const activeGameId = activeGameIdQueryResult.data?.activeGameId || 1;

  const [dispatchGameAction] = useDispatchGameActionMutation(activeGameId);

  const gameUser = findGameUser(gameUsers, user, { isYours });

  const handleClick = async () => {
    if (!actionStatus.isStarted()) {
      return;
    }

    // handle action operation
    let newActionStatus = new ActionStatus();

    newActionStatus = actionStatus.addPayloadTargetGameUserId(gameUser!.id);

    if (newActionStatus.isCompleted()) {
      const { type, payload } = newActionStatus;
      await dispatchGameAction({
        variables: {
          id: activeGameId,
          data: { type: type!, payload },
        },
      });
      newActionStatus = new ActionStatus();
    }

    await dispatch({
      type: 'SET_ACTION_STATUS',
      payload: newActionStatus,
    });
  };

  return (
    <>
      <StyledCol md={6}>
        <UserLogo picture={gameUser?.user.photoURL} onClick={handleClick} />
        <UserInfo>
          <UserName>{gameUser?.user.displayName}</UserName>
          <div>
            ライフ：{gameUser?.lifePoint} / エナジー：
            {gameUser?.energy}
          </div>
        </UserInfo>
      </StyledCol>
      <StyledCol md={6}>
        {gameUser?.actionTypes.map((value) => (
          <GameActionButton type={value} />
        ))}
      </StyledCol>
    </>
  );
}
