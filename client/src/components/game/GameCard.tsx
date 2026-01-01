import { useContext } from 'react';
import { Card, CardImg } from 'reactstrap';
import styled from 'styled-components';
import { BACK_SIDE_CARD } from '../../constants/pictures';
import { AppContext } from '../../contexts/AppContext';
import {
  type GameCardFragment,
  Zone,
  BattlePosition,
  useActiveGameIdQuery,
} from '../../graphql/generated/graphql-client';
import ActionStatus from '../../models/ActionStatus';
import { ActionStep } from '../../constants/action-steps';
import { useDispatchGameActionMutation } from '../../hooks/useDispatchGameActionMutation';

const StyledCard = styled(Card)<{ $isDefence: boolean; $isSelected: boolean }>`
  min-width: 60px;
  width: 60px;
  margin: 5px;
  transform: ${(props) => (props.$isDefence ? 'rotate(-90deg)' : 'none')};
  border: ${(props) => (props.$isSelected ? '3px solid red' : 'none')};
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

    if (
      actionStatus.step === ActionStep.SELECT_POWER_DOWN_TARGET &&
      data.zone === Zone.Battle &&
      data.currentUserId !== user.data?.uid
    ) {
      newActionStatus = actionStatus.addPayloadTargetGameCardId(data.id);
    }

    if (
      actionStatus.step === ActionStep.SELECT_DESTROY_TARGET &&
      data.zone === Zone.Battle &&
      data.currentUserId !== user.data?.uid
    ) {
      newActionStatus = actionStatus.addPayloadTargetGameCardId(data.id);
    }

    if (
      actionStatus.step === ActionStep.SELECT_SOUL_CANON_COST &&
      data.zone === Zone.Soul &&
      data.currentUserId === user.data?.uid
    ) {
      newActionStatus = actionStatus.addPayloadCostGameCardId(data.id);
    }

    if (
      actionStatus.step === ActionStep.SELECT_SOUL_CANON_TARGET &&
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

  const isDefence = data.battlePosition === BattlePosition.Defence;

  const isSelected =
    actionStatus.payload.costGameCardIds?.includes(data.id) ||
    actionStatus.payload.targetGameCardIds?.includes(data.id) ||
    false;

  return (
    <StyledCard
      onClick={handleClick}
      $isDefence={isDefence}
      $isSelected={isSelected}
    >
      <CardImg src={data.card?.picture || BACK_SIDE_CARD} />
    </StyledCard>
  );
}
