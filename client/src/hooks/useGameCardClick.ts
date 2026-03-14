import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { AttackAnimationContext } from '../contexts/AttackAnimationContext';
import {
  ActionType,
  type GameCardFragment,
  Zone,
} from '../graphql/generated/graphql-client';
import ActionStatus from '../models/ActionStatus';
import { ActionStep } from '../constants/action-steps';
import { useDispatchGameActionMutation } from './useDispatchGameActionMutation';

export function useGameCardClick(data: GameCardFragment, gameId: number) {
  const {
    state: { gameCardModal, actionStatus, user },
    dispatch,
  } = useContext(AppContext);
  const { startAttackAnimation } = useContext(AttackAnimationContext);

  const [dispatchGameAction] = useDispatchGameActionMutation(gameId);

  const handleClick = async () => {
    if (data.card && !actionStatus.isStarted()) {
      dispatch({
        type: 'SET_GAME_CARD_MODAL',
        payload: gameCardModal.open(data),
      });
      return;
    }

    let newActionStatus = actionStatus;

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

    if (
      actionStatus.step === ActionStep.SELECT_SPEED_DRAGON_BIRD_COST &&
      data.zone === Zone.Soul &&
      data.currentUserId === user.data?.uid
    ) {
      newActionStatus = actionStatus.addPayloadCostGameCardId(data.id);
    }

    if (
      actionStatus.step === ActionStep.SELECT_SPEED_DRAGON_BIRD_TARGET &&
      data.zone === Zone.Battle &&
      data.currentUserId !== user.data?.uid
    ) {
      newActionStatus = actionStatus.addPayloadTargetGameCardId(data.id);
    }

    if (
      actionStatus.step === ActionStep.SELECT_FRESH_FISH_COST &&
      data.zone === Zone.Soul &&
      data.currentUserId === user.data?.uid
    ) {
      newActionStatus = actionStatus.addPayloadCostGameCardId(data.id);
    }

    if (
      actionStatus.step === ActionStep.SELECT_HEDRON_COST &&
      data.zone === Zone.Soul &&
      data.currentUserId === user.data?.uid
    ) {
      newActionStatus = actionStatus.addPayloadCostGameCardId(data.id);
    }

    if (newActionStatus.isCompleted() && newActionStatus.type) {
      const { type, payload } = newActionStatus;

      if (type === ActionType.Attack && payload.gameCardId) {
        await startAttackAnimation({
          attackerGameCardId: payload.gameCardId,
          targetGameCardId: payload.targetGameCardIds?.[0] ?? null,
          targetGameUserId: payload.targetGameUserIds?.[0] ?? null,
        });
      }

      await dispatchGameAction({
        variables: {
          id: gameId,
          data: { type, payload },
        },
      });
      newActionStatus = new ActionStatus();
    }

    dispatch({
      type: 'SET_ACTION_STATUS',
      payload: newActionStatus,
    });
  };

  return { handleClick };
}
