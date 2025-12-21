import { GameModel } from '../../../models/game.model';
import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
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
import { validateEffectFreshFishDrawAction } from '../validators/effectFreshFishDraw';
import { validateEffectNatsukashinorudePowerDownAction } from '../validators/effectNatsukashinorudePowerDown';
import { PutSoulActionPayload } from '../handlers/putSoul';
import { AttackActionPayload } from '../handlers/attack';
import { FinishEndTimeActionPayload } from '../handlers/finishEndTime';
import { EffectRuteruteDrawActionPayload } from '../handlers/effectRuteruteDraw';
import { EffectFreshFishDrawActionPayload } from '../handlers/effectFreshFishDraw';
import { EffectNatsukashinorudePowerDownActionPayload } from '../handlers/effectNatsukashinorudePowerDown';

type ValidationResult =
  | { type: ActionType.START_DRAW_TIME }
  | { type: ActionType.START_ENERGY_TIME }
  | { type: ActionType.START_PUT_TIME }
  | { type: ActionType.PUT_SOUL; payload: PutSoulActionPayload }
  | { type: ActionType.START_SOMETHING_TIME }
  | { type: ActionType.SUMMON_MONSTER; payload: GameActionDispatchInput }
  | { type: ActionType.START_BATTLE_TIME }
  | { type: ActionType.START_END_TIME }
  | { type: ActionType.ATTACK; payload: AttackActionPayload }
  | { type: ActionType.FINISH_END_TIME; payload: FinishEndTimeActionPayload }
  | { type: ActionType.EFFECT_RUTERUTE_DRAW; payload: EffectRuteruteDrawActionPayload }
  | { type: ActionType.EFFECT_FRESH_FISH_DRAW; payload: EffectFreshFishDrawActionPayload }
  | { type: ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN; payload: EffectNatsukashinorudePowerDownActionPayload };

export const validateAction = (
  data: GameActionDispatchInput,
  userId: string,
  gameModel: GameModel,
): ValidationResult => {
  switch (data.type) {
    case ActionType.START_DRAW_TIME: {
      validateStartDrawTimeAction(gameModel, userId);
      return { type: ActionType.START_DRAW_TIME };
    }
    case ActionType.START_ENERGY_TIME: {
      validateStartEnergyTimeAction(gameModel, userId);
      return { type: ActionType.START_ENERGY_TIME };
    }
    case ActionType.START_PUT_TIME: {
      validateStartPutTimeAction(gameModel, userId);
      return { type: ActionType.START_PUT_TIME };
    }
    case ActionType.PUT_SOUL: {
      const payload: PutSoulActionPayload = validatePutSoulAction(data, gameModel, userId);
      return { type: ActionType.PUT_SOUL, payload };
    }
    case ActionType.START_SOMETHING_TIME: {
      validateStartSomethingTimeAction(gameModel, userId);
      return { type: ActionType.START_SOMETHING_TIME };
    }
    case ActionType.SUMMON_MONSTER: {
      return { type: ActionType.SUMMON_MONSTER, payload: data };
    }
    case ActionType.START_BATTLE_TIME: {
      validateStartBattleTimeAction(gameModel, userId);
      return { type: ActionType.START_BATTLE_TIME };
    }
    case ActionType.START_END_TIME: {
      validateStartEndTimeAction(gameModel, userId);
      return { type: ActionType.START_END_TIME };
    }
    case ActionType.ATTACK: {
      const payload = validateAttackAction(data, gameModel, userId);
      return { type: ActionType.ATTACK, payload };
    }
    case ActionType.FINISH_END_TIME: {
      const payload = validateFinishEndTimeAction(gameModel, userId);
      return { type: ActionType.FINISH_END_TIME, payload };
    }
    case ActionType.EFFECT_RUTERUTE_DRAW: {
      const payload = validateEffectRuteruteDrawAction(data, gameModel);
      return { type: ActionType.EFFECT_RUTERUTE_DRAW, payload };
    }
    case ActionType.EFFECT_FRESH_FISH_DRAW: {
      const payload = validateEffectFreshFishDrawAction(data, gameModel);
      return { type: ActionType.EFFECT_FRESH_FISH_DRAW, payload };
    }
    case ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN: {
      const payload = validateEffectNatsukashinorudePowerDownAction(data, gameModel, userId);
      return { type: ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN, payload };
    }
    default: {
      throw new Error('Invalid action type');
    }
  }
};
