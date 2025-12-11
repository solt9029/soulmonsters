import { GameModel } from '../../../models/game.model';
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
import { validateStartBattleTimeAction } from '../validators/startBattleTime';
import { validateFinishEndTimeAction } from '../validators/finishEndTime';

// TODO: userIdよりもgameUserIdを受け取った方が便利かも？だけど、現状はgameCardがuserIdしか持っていないっぽいのでやや不便か？
// 理想メモ: game, gameUserId, opponentGameUser, data, manager
export async function handleAction(
  data: GameActionDispatchInput,
  manager: EntityManager,
  userId: string,
  gameModel: GameModel,
) {
  switch (data.type) {
    case ActionType.START_DRAW_TIME: {
      validateStartDrawTimeAction(gameModel, userId);
      return await handleStartDrawTimeAction(manager, userId, gameModel);
    }
    case ActionType.START_ENERGY_TIME: {
      validateStartEnergyTimeAction(gameModel, userId);
      return await handleStartEnergyTimeAction(manager, userId, gameModel);
    }
    case ActionType.START_PUT_TIME: {
      validateStartPutTimeAction(gameModel, userId);
      return await handleStartPutTimeAction(manager, gameModel);
    }
    case ActionType.PUT_SOUL: {
      const payload = validatePutSoulAction(data, gameModel, userId);
      return await handlePutSoulAction(manager, userId, payload, gameModel);
    }
    case ActionType.START_SOMETHING_TIME: {
      validateStartSomethingTimeAction(gameModel, userId);
      return await handleStartSomethingTimeAction(manager, gameModel);
    }
    case ActionType.SUMMON_MONSTER: {
      return await handleSummonMonsterAction(manager, userId, data, gameModel);
    }
    case ActionType.START_BATTLE_TIME: {
      validateStartBattleTimeAction(gameModel, userId);
      return await handleStartBattleTimeAction(manager, gameModel);
    }
    case ActionType.START_END_TIME: {
      validateStartEndTimeAction(gameModel, userId);
      return await handleStartEndTimeAction(manager, gameModel);
    }
    case ActionType.ATTACK: {
      const payload = validateAttackAction(data, gameModel, userId);
      return await handleAttackAction(manager, userId, payload, gameModel);
    }
    case ActionType.FINISH_END_TIME: {
      const payload = validateFinishEndTimeAction(gameModel, userId);
      return await handleFinishEndTimeAction(manager, payload, gameModel);
    }
    case ActionType.EFFECT_RUTERUTE_DRAW: {
      return await handleEffectRuteruteDraw(manager, userId, data, gameModel);
    }
    default: {
      return;
    }
  }
}
