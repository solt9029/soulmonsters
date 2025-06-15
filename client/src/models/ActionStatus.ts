import { InitialActionStep } from './../constants/initial-action-steps';
import {
  ActionType,
  ActionPayload,
} from './../graphql/generated/graphql-client';
import { Record } from 'immutable';
import { ActionStep } from '../constants/action-steps';

export interface ActionStatusInterface {
  type: ActionType | null;
  payload: ActionPayload;
  step: ActionStep | null;
}

export default class ActionStatus extends Record<ActionStatusInterface>(
  {
    type: null,
    payload: {
      gameCardId: undefined,
      targetGameCardIds: [],
      costGameCardIds: [],
      targetGameUserIds: [],
    },
    step: null,
  },
  'ActionStatus'
) {
  start(data: { type: ActionType; gameCardId?: number }): ActionStatus {
    const { type, gameCardId } = data;
    return new ActionStatus({
      type: type,
      step: InitialActionStep[type],
      payload: { gameCardId },
    });
  }

  addPayloadTargetGameCardId(id: number) {
    return this.set('payload', {
      ...this.payload,
      targetGameCardIds: [...(this.payload.targetGameCardIds || []), id],
    }).updateStep();
  }

  addPayloadTargetGameUserId(id: number) {
    return this.set('payload', {
      ...this.payload,
      targetGameUserIds: [...(this.payload.targetGameUserIds || []), id],
    }).updateStep();
  }

  addPayloadCostGameCardId(id: number) {
    return this.set('payload', {
      ...this.payload,
      costGameCardIds: [...(this.payload.costGameCardIds || []), id],
    }).updateStep();
  }

  updateStep(): ActionStatus {
    const { type, payload, step } = this;

    if (type === ActionType.Attack) {
      if (step === ActionStep.SELECT_ATTACK_TARGET) {
        const { targetGameCardIds, targetGameUserIds } = payload;
        if (
          targetGameCardIds?.length === 1 ||
          targetGameUserIds?.length === 1
        ) {
          return this.set('step', ActionStep.COMPLETED);
        }
      }
    }

    return this;
  }

  isStarted() {
    return this.type !== null;
  }

  isCompleted() {
    return this.step === ActionStep.COMPLETED;
  }
}
