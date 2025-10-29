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
import { handleEffectRuteruteDraw } from './effectRuteruteDraw';
import { ValidationResult } from '../validators/index';

// TODO: userIdよりもgameUserIdを受け取った方が便利かも？だけど、現状はgameCardがuserIdしか持っていないっぽいのでやや不便か？
// 理想メモ: game, gameUserId, opponentGameUser, data, manager
export async function handleAction(
  data: GameActionDispatchInput,
  manager: EntityManager,
  userId: string,
  gameEntity: GameEntity,
  validationResult: ValidationResult,
) {
  switch (data.type) {
    case ActionType.START_DRAW_TIME:
      return await handleStartDrawTimeAction(manager, userId, gameEntity);
    case ActionType.START_ENERGY_TIME:
      return await handleStartEnergyTimeAction(manager, userId, gameEntity);
    case ActionType.START_PUT_TIME:
      return await handleStartPutTimeAction(manager, gameEntity);
    case ActionType.PUT_SOUL:
      if (validationResult) {
        return await handlePutSoulAction(manager, userId, validationResult, gameEntity);
      }
      throw new Error('Validation result required for PUT_SOUL action');
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
      return await handleFinishEndTimeAction(manager, userId, gameEntity);
    case ActionType.EFFECT_RUTERUTE_DRAW:
      return await handleEffectRuteruteDraw(manager, userId, data, gameEntity);
    default:
      return;
  }
}
