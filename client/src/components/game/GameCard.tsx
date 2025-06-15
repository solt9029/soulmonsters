import React, { useContext } from 'react';
import { Card, CardImg } from 'reactstrap';
import styled from 'styled-components';
import { BACK_SIDE_CARD } from '../../constants/pictures';
import { AppContext } from '../App';
import {
  GameCardFragment,
  Zone,
  useActiveGameIdQuery,
} from '../../graphql/generated/graphql-client';
import ActionStatus from '../../models/ActionStatus';
import { ActionStep } from '../../constants/action-steps';
import { useDispatchGameActionMutation } from '../../hooks/useDispatchGameActionMutation';

const StyledCard = styled(Card)`
  min-width: 60px;
  width: 60px;
  margin: 5px;
`;

export type GameCardProps = {
  data: GameCardFragment;
};

export default function GameCard({ data }: GameCardProps) {
  const {
    state: { gameCardModal, actionStatus, user },
    dispatch,
  } = useContext(AppContext);

  const activeGameIdQueryResult = useActiveGameIdQuery();
  const activeGameId = activeGameIdQueryResult.data?.activeGameId || 1;

  const [dispatchGameAction] = useDispatchGameActionMutation(activeGameId);

  const handleClick = async () => {
    // open modal
    if (data.card && !actionStatus.isStarted()) {
      await dispatch({
        type: 'SET_GAME_CARD_MODAL',
        payload: gameCardModal.open(data),
      });
      return;
    }

    // handle action operation
    let newActionStatus = new ActionStatus();

    if (
      actionStatus.step === ActionStep.SELECT_ATTACK_TARGET &&
      data.zone === Zone.Battle &&
      data.currentUserId !== user.data?.uid
    ) {
      newActionStatus = actionStatus.addPayloadTargetGameCardId(data.id);
    }

    if (newActionStatus.isCompleted() && newActionStatus.type) {
      const { type, payload } = newActionStatus;
      await dispatchGameAction({
        variables: {
          id: activeGameId,
          data: { type, payload },
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
    <StyledCard onClick={handleClick}>
      <CardImg src={data.card?.picture || BACK_SIDE_CARD} />
    </StyledCard>
  );
}
