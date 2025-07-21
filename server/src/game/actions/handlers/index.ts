import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { handleStartDrawTimeAction } from './startDrawTime';
import { EntityManager } from 'typeorm';
import { handleStartEnergyTimeAction } from './startEnergyTime';
import { handleStartPutTimeAction } from './startPutTime';
import { handlePutSoulAction } from './putSoul';
import { handleStartSomethingTimeAction } from './startSomethingTime';
import { handleSummonMonsterAction } from './summonMonster';
import { handleStartBattleTimeAction } from './startBattleTime';
import { handleStartEndTimeAction } from './startEndTime';
import { handleAttackAction } from './attack';
import { handleFinishEndTimeAction } from './finishEndTime';

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
      return await handleStartPutTimeAction(manager, gameEntity);
    case ActionType.PUT_SOUL:
      return await handlePutSoulAction(manager, userId, data, gameEntity);
    case ActionType.START_SOMETHING_TIME:
      return await handleStartSomethingTimeAction(manager, gameEntity);
    case ActionType.SUMMON_MONSTER:
      return await handleSummonMonsterAction(manager, userId, data, gameEntity);
    case ActionType.START_BATTLE_TIME:
      return await handleStartBattleTimeAction(manager, gameEntity);
    case ActionType.START_END_TIME:
      return await handleStartEndTimeAction(manager, gameEntity);
    case ActionType.ATTACK:
      return await handleAttackAction(manager, userId, data, gameEntity);
    case ActionType.FINISH_END_TIME:
      return await handleFinishEndTimeAction(manager, userId, id, gameEntity);
    default:
      return;
  }
}
