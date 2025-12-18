import { Injectable } from '@nestjs/common';
import { GameModel } from '../../../models/game.model';
import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { handleStartDrawTimeAction } from './startDrawTime';
import { handleStartEnergyTimeAction } from './startEnergyTime';
import { handleStartPutTimeAction } from './startPutTime';
import { handlePutSoulAction, PutSoulActionPayload } from './putSoul';
import { handleStartSomethingTimeAction } from './startSomethingTime';
import { handleSummonMonsterAction } from './summonMonster';
import { handleStartBattleTimeAction } from './startBattleTime';
import { handleStartEndTimeAction } from './startEndTime';
import { handleAttackAction } from './attack';
import { handleFinishEndTimeAction, FinishEndTimeActionPayload } from './finishEndTime';
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
import { validateEffectRuteruteDrawAction } from '../validators/effectRuteruteDraw';

@Injectable()
export class GameActionHandler {
  handleAction(data: GameActionDispatchInput, userId: string, gameModel: GameModel) {
    switch (data.type) {
      case ActionType.START_DRAW_TIME: {
        validateStartDrawTimeAction(gameModel, userId);
        return handleStartDrawTimeAction(userId, gameModel);
      }
      case ActionType.START_ENERGY_TIME: {
        validateStartEnergyTimeAction(gameModel, userId);
        return handleStartEnergyTimeAction(userId, gameModel);
      }
      case ActionType.START_PUT_TIME: {
        validateStartPutTimeAction(gameModel, userId);
        return handleStartPutTimeAction(gameModel);
      }
      case ActionType.PUT_SOUL: {
        const payload: PutSoulActionPayload = validatePutSoulAction(data, gameModel, userId);
        return handlePutSoulAction(userId, payload, gameModel);
      }
      case ActionType.START_SOMETHING_TIME: {
        validateStartSomethingTimeAction(gameModel, userId);
        return handleStartSomethingTimeAction(gameModel);
      }
      case ActionType.SUMMON_MONSTER: {
        return handleSummonMonsterAction(userId, data, gameModel);
      }
      case ActionType.START_BATTLE_TIME: {
        validateStartBattleTimeAction(gameModel, userId);
        return handleStartBattleTimeAction(gameModel);
      }
      case ActionType.START_END_TIME: {
        validateStartEndTimeAction(gameModel, userId);
        return handleStartEndTimeAction(gameModel);
      }
      case ActionType.ATTACK: {
        const payload = validateAttackAction(data, gameModel, userId);
        return handleAttackAction(userId, payload, gameModel);
      }
      case ActionType.FINISH_END_TIME: {
        const payload: FinishEndTimeActionPayload = validateFinishEndTimeAction(gameModel, userId);
        return handleFinishEndTimeAction(payload, gameModel);
      }
      case ActionType.EFFECT_RUTERUTE_DRAW: {
        const payload = validateEffectRuteruteDrawAction(data, gameModel);
        return handleEffectRuteruteDraw(userId, payload, gameModel);
      }
      default: {
        return gameModel;
      }
    }
  }
}
