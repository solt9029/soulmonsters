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
import { PutSoulValidationResult } from '../validators/putSoul';
import { AttackValidationResult } from '../validators/attack';

// TODO: userIdよりもgameUserIdを受け取った方が便利かも？だけど、現状はgameCardがuserIdしか持っていないっぽいのでやや不便か？
// 理想メモ: game, gameUserId, opponentGameUser, data, manager
export async function handleAction(
  data: GameActionDispatchInput,
  manager: EntityManager,
  userId: string,
  gameEntity: GameEntity,
  validationResult?: PutSoulValidationResult | AttackValidationResult,
) {
  switch (data.type) {
    case ActionType.START_DRAW_TIME:
      return await handleStartDrawTimeAction(manager, userId, gameEntity);
    case ActionType.START_ENERGY_TIME:
      return await handleStartEnergyTimeAction(manager, userId, gameEntity);
    case ActionType.START_PUT_TIME:
      return await handleStartPutTimeAction(manager, gameEntity);
    case ActionType.PUT_SOUL:
      if (validationResult && 'gameCard' in validationResult && 'gameUser' in validationResult && 'gameCardId' in validationResult && !('attackTarget' in validationResult)) {
        return await handlePutSoulAction(manager, userId, validationResult as PutSoulValidationResult, gameEntity);
      }
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
      if (validationResult && 'attackTarget' in validationResult) {
        return await handleAttackAction(manager, userId, validationResult as AttackValidationResult, gameEntity);
      }
      return await handleAttackAction(manager, userId, data, gameEntity);
    case ActionType.FINISH_END_TIME:
      return await handleFinishEndTimeAction(manager, userId, gameEntity);
    case ActionType.EFFECT_RUTERUTE_DRAW:
      return await handleEffectRuteruteDraw(manager, userId, data, gameEntity);
    default:
      return;
  }
}
