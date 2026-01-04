import { Injectable } from '@nestjs/common';
import { GameModel } from '../../../models/game.model';
import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { handleStartDrawTimeAction } from './startDrawTime';
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
import { handleEffectFreshFishDraw } from './effectFreshFishDraw';
import { handleEffectNatsukashinorudePowerDown } from './effectNatsukashinorudePowerDown';
import { handleEffectEmeraldEnergyIncrease } from './effectEmeraldEnergyIncrease';
import { handleEffectSupernewvoltsDestroyMonster } from './effectSupernewvoltsDestroyMonster';
import { handleEffectSpeedDragonBirdChangePosition } from './effectSpeedDragonBirdChangePosition';
import { handleChangeBattlePositionAction } from './changeBattlePosition';
import { handleUseSoulCanonAction } from './useSoulCanon';
import { validateAction } from '../validators';

@Injectable()
export class GameActionHandler {
  handleAction(data: GameActionDispatchInput, userId: string, gameModel: GameModel) {
    const validationResult = validateAction(data, userId, gameModel);

    switch (validationResult.type) {
      case ActionType.START_DRAW_TIME: {
        return handleStartDrawTimeAction(userId, gameModel);
      }
      case ActionType.START_ENERGY_TIME: {
        // TODO: gameUserが存在するかどうかのバリデーションを行い, ValidationResultとしてgameUserを渡す
        return handleStartEnergyTimeAction(userId, gameModel);
      }
      case ActionType.START_PUT_TIME: {
        return handleStartPutTimeAction(gameModel);
      }
      case ActionType.PUT_SOUL: {
        return handlePutSoulAction(userId, validationResult.payload, gameModel);
      }
      case ActionType.START_SOMETHING_TIME: {
        return handleStartSomethingTimeAction(gameModel);
      }
      case ActionType.SUMMON_MONSTER: {
        return handleSummonMonsterAction(userId, validationResult.payload, gameModel);
      }
      case ActionType.START_BATTLE_TIME: {
        return handleStartBattleTimeAction(gameModel);
      }
      case ActionType.START_END_TIME: {
        return handleStartEndTimeAction(gameModel);
      }
      case ActionType.ATTACK: {
        return handleAttackAction(userId, validationResult.payload, gameModel);
      }
      case ActionType.FINISH_END_TIME: {
        return handleFinishEndTimeAction(validationResult.payload, gameModel);
      }
      case ActionType.EFFECT_RUTERUTE_DRAW: {
        return handleEffectRuteruteDraw(userId, validationResult.payload, gameModel);
      }
      case ActionType.EFFECT_FRESH_FISH_DRAW: {
        return handleEffectFreshFishDraw(userId, validationResult.payload, gameModel);
      }
      case ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN: {
        return handleEffectNatsukashinorudePowerDown(userId, validationResult.payload, gameModel);
      }
      case ActionType.EFFECT_EMERALD_ENERGY_INCREASE: {
        return handleEffectEmeraldEnergyIncrease(userId, validationResult.payload, gameModel);
      }
      case ActionType.CHANGE_BATTLE_POSITION: {
        return handleChangeBattlePositionAction(validationResult.payload, gameModel);
      }
      case ActionType.USE_SOUL_CANON: {
        return handleUseSoulCanonAction(userId, validationResult.payload, gameModel);
      }
      case ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER: {
        return handleEffectSupernewvoltsDestroyMonster(userId, validationResult.payload, gameModel);
      }
      case ActionType.EFFECT_SPEED_DRAGON_BIRD_CHANGE_POSITION: {
        return handleEffectSpeedDragonBirdChangePosition(userId, validationResult.payload, gameModel);
      }
      default: {
        return gameModel;
      }
    }
  }
}
