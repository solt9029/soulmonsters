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
import { validateStartDrawTimeAction } from '../validators/startDrawTime';
import { validateStartEnergyTimeAction } from '../validators/startEnergyTime';
import { validateStartPutTimeAction } from '../validators/startPutTime';
import { validatePutSoulAction } from '../validators/putSoul';
import { validateAttackAction } from '../validators/attack';
import { validateStartEndTimeAction } from '../validators/startEndTime';
import { validateStartSomethingTimeAction } from '../validators/startSomethingTime';

// TODO: userIdよりもgameUserIdを受け取った方が便利かも？だけど、現状はgameCardがuserIdしか持っていないっぽいのでやや不便か？
// 理想メモ: game, gameUserId, opponentGameUser, data, manager
export async function handleAction(
  data: GameActionDispatchInput,
  manager: EntityManager,
  userId: string,
  gameEntity: GameEntity,
) {
  switch (data.type) {
    case ActionType.START_DRAW_TIME: {
      validateStartDrawTimeAction(gameEntity, userId);
      return await handleStartDrawTimeAction(manager, userId, gameEntity);
    }
    case ActionType.START_ENERGY_TIME: {
      validateStartEnergyTimeAction(gameEntity, userId);
      return await handleStartEnergyTimeAction(manager, userId, gameEntity);
    }
    case ActionType.START_PUT_TIME: {
      validateStartPutTimeAction(gameEntity, userId);
      return await handleStartPutTimeAction(manager, gameEntity);
    }
    case ActionType.PUT_SOUL: {
      const payload = validatePutSoulAction(data, gameEntity, userId);
      return await handlePutSoulAction(manager, userId, payload, gameEntity);
    }
    case ActionType.START_SOMETHING_TIME: {
      validateStartSomethingTimeAction(gameEntity, userId);
      return await handleStartSomethingTimeAction(manager, gameEntity);
    }
    case ActionType.SUMMON_MONSTER: {
      return await handleSummonMonsterAction(manager, userId, data, gameEntity);
    }
    case ActionType.START_BATTLE_TIME: {
      return await handleStartBattleTimeAction(manager, gameEntity);
    }
    case ActionType.START_END_TIME: {
      validateStartEndTimeAction(gameEntity, userId);
      return await handleStartEndTimeAction(manager, gameEntity);
    }
    case ActionType.ATTACK: {
      const payload = validateAttackAction(data, gameEntity, userId);
      return await handleAttackAction(manager, userId, payload, gameEntity);
    }
    case ActionType.FINISH_END_TIME: {
      return await handleFinishEndTimeAction(manager, userId, gameEntity);
    }
    case ActionType.EFFECT_RUTERUTE_DRAW: {
      return await handleEffectRuteruteDraw(manager, userId, data, gameEntity);
    }
    default: {
      return;
    }
  }
}
