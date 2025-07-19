import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { handleStartDrawTimeAction } from './handleStartDrawTimeAction';
import { EntityManager } from 'typeorm';
import { handleStartEnergyTimeAction } from './handleStartEnergyTimeAction';
import { handleStartPutTimeAction } from './handleStartPutTimeAction';
import { handlePutSoulAction } from './handlePutSoulAction';
import { handleStartSomethingTimeAction } from './handleStartSomethingTimeAction';
import { handleSummonMonsterAction } from './handleSummonMonsterAction';
import { handleStartBattleTimeAction } from './handleStartBattleTimeAction';
import { handleStartEndTimeAction } from './handleStartEndTimeAction';
import { handleAttackAction } from './handleAttackAction';
import { handleFinishEndTimeAction } from './handleFinishEndTimeAction';

export async function handleAction(
  id: number,
  data: GameActionDispatchInput,
  manager: EntityManager,
  userId: string,
  gameEntity: GameEntity,
) {
  switch (data.type) {
    case ActionType.START_DRAW_TIME:
      return await handleStartDrawTimeAction(manager, id, userId, gameEntity);
    case ActionType.START_ENERGY_TIME:
      return await handleStartEnergyTimeAction(manager, id, userId, gameEntity);
    case ActionType.START_PUT_TIME:
      return await handleStartPutTimeAction(manager, id);
    case ActionType.PUT_SOUL:
      return await handlePutSoulAction(manager, userId, data, gameEntity);
    case ActionType.START_SOMETHING_TIME:
      return await handleStartSomethingTimeAction(manager, id);
    case ActionType.SUMMON_MONSTER:
      return await handleSummonMonsterAction(manager, userId, data, gameEntity);
    case ActionType.START_BATTLE_TIME:
      return await handleStartBattleTimeAction(manager, id);
    case ActionType.START_END_TIME:
      return await handleStartEndTimeAction(manager, id);
    case ActionType.ATTACK:
      return await handleAttackAction(manager, userId, data, gameEntity);
    case ActionType.FINISH_END_TIME:
      return await handleFinishEndTimeAction(manager, userId, id, gameEntity);
    default:
      return;
  }
}
