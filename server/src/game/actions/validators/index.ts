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
import { validateEffectEmeraldEnergyIncreaseAction } from '../validators/effectEmeraldEnergyIncrease';
import { validateChangeBattlePositionAction } from '../validators/changeBattlePosition';
import { validateSummonMonsterAction } from '../validators/summonMonster';
import { validateUseSoulCanonAction } from '../validators/useSoulCanon';
import { validateEffectSupernewvoltsDestroyMonsterAction } from '../validators/effectSupernewvoltsDestroyMonster';
import { validateEffectSpeedDragonBirdChangePositionAction } from '../validators/effectSpeedDragonBirdChangePosition';
import { validateSelectAsHamontakiTargetAction } from '../validators/selectAsHamontakiTarget';
import { validateUseHedronAction } from '../validators/useHedron';
import { validateSelectAsHedronTargetAction } from '../validators/selectAsHedronTarget';
import { PutSoulActionPayload } from '../handlers/putSoul';
import { AttackActionPayload } from '../handlers/attack';
import { FinishEndTimeActionPayload } from '../handlers/finishEndTime';
import { EffectRuteruteDrawActionPayload } from '../handlers/effectRuteruteDraw';
import { EffectFreshFishDrawActionPayload } from '../handlers/effectFreshFishDraw';
import { EffectNatsukashinorudePowerDownActionPayload } from '../handlers/effectNatsukashinorudePowerDown';
import { EffectEmeraldEnergyIncreaseActionPayload } from '../handlers/effectEmeraldEnergyIncrease';
import { EffectSupernewvoltsDestroyMonsterActionPayload } from '../handlers/effectSupernewvoltsDestroyMonster';
import { EffectSpeedDragonBirdChangePositionActionPayload } from '../handlers/effectSpeedDragonBirdChangePosition';
import { ChangeBattlePositionActionPayload } from '../handlers/changeBattlePosition';
import { SummonMonsterActionPayload } from '../validators/summonMonster';
import { UseSoulCanonActionPayload } from '../handlers/useSoulCanon';
import { SelectAsHamontakiTargetActionPayload } from '../handlers/selectAsHamontakiTarget';
import { UseHedronActionPayload } from '../handlers/useHedron';
import { SelectAsHedronTargetActionPayload } from '../handlers/selectAsHedronTarget';

type ValidationResult =
  | { type: ActionType.START_DRAW_TIME }
  | { type: ActionType.START_ENERGY_TIME }
  | { type: ActionType.START_PUT_TIME }
  | { type: ActionType.PUT_SOUL; payload: PutSoulActionPayload }
  | { type: ActionType.START_SOMETHING_TIME }
  | { type: ActionType.SUMMON_MONSTER; payload: SummonMonsterActionPayload }
  | { type: ActionType.START_BATTLE_TIME }
  | { type: ActionType.START_END_TIME }
  | { type: ActionType.ATTACK; payload: AttackActionPayload }
  | { type: ActionType.FINISH_END_TIME; payload: FinishEndTimeActionPayload }
  | { type: ActionType.EFFECT_RUTERUTE_DRAW; payload: EffectRuteruteDrawActionPayload }
  | { type: ActionType.EFFECT_FRESH_FISH_DRAW; payload: EffectFreshFishDrawActionPayload }
  | { type: ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN; payload: EffectNatsukashinorudePowerDownActionPayload }
  | { type: ActionType.EFFECT_EMERALD_ENERGY_INCREASE; payload: EffectEmeraldEnergyIncreaseActionPayload }
  | {
      type: ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER;
      payload: EffectSupernewvoltsDestroyMonsterActionPayload;
    }
  | {
      type: ActionType.EFFECT_SPEED_DRAGON_BIRD_CHANGE_POSITION;
      payload: EffectSpeedDragonBirdChangePositionActionPayload;
    }
  | { type: ActionType.CHANGE_BATTLE_POSITION; payload: ChangeBattlePositionActionPayload }
  | { type: ActionType.USE_SOUL_CANON; payload: UseSoulCanonActionPayload }
  | { type: ActionType.SELECT_AS_HAMONTAKI_TARGET; payload: SelectAsHamontakiTargetActionPayload }
  | { type: ActionType.USE_HEDRON; payload: UseHedronActionPayload }
  | { type: ActionType.SELECT_AS_HEDRON_TARGET; payload: SelectAsHedronTargetActionPayload };

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
      const payload = validateSummonMonsterAction(data, gameModel, userId);
      return { type: ActionType.SUMMON_MONSTER, payload };
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
      const payload = validateEffectRuteruteDrawAction(data, gameModel, userId);
      return { type: ActionType.EFFECT_RUTERUTE_DRAW, payload };
    }
    case ActionType.EFFECT_FRESH_FISH_DRAW: {
      const payload = validateEffectFreshFishDrawAction(data, gameModel, userId);
      return { type: ActionType.EFFECT_FRESH_FISH_DRAW, payload };
    }
    case ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN: {
      const payload = validateEffectNatsukashinorudePowerDownAction(data, gameModel, userId);
      return { type: ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN, payload };
    }
    case ActionType.EFFECT_EMERALD_ENERGY_INCREASE: {
      const payload = validateEffectEmeraldEnergyIncreaseAction(data, gameModel);
      return { type: ActionType.EFFECT_EMERALD_ENERGY_INCREASE, payload };
    }
    case ActionType.CHANGE_BATTLE_POSITION: {
      const payload = validateChangeBattlePositionAction(data, gameModel);
      return { type: ActionType.CHANGE_BATTLE_POSITION, payload };
    }
    case ActionType.USE_SOUL_CANON: {
      const payload = validateUseSoulCanonAction(data, gameModel, userId);
      return { type: ActionType.USE_SOUL_CANON, payload };
    }
    case ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER: {
      const payload = validateEffectSupernewvoltsDestroyMonsterAction(data, gameModel, userId);
      return { type: ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER, payload };
    }
    case ActionType.EFFECT_SPEED_DRAGON_BIRD_CHANGE_POSITION: {
      const payload = validateEffectSpeedDragonBirdChangePositionAction(data, gameModel, userId);
      return { type: ActionType.EFFECT_SPEED_DRAGON_BIRD_CHANGE_POSITION, payload };
    }
    case ActionType.SELECT_AS_HAMONTAKI_TARGET: {
      const payload = validateSelectAsHamontakiTargetAction(data, gameModel);
      return { type: ActionType.SELECT_AS_HAMONTAKI_TARGET, payload };
    }
    case ActionType.USE_HEDRON: {
      const payload = validateUseHedronAction(data, gameModel, userId);
      return { type: ActionType.USE_HEDRON, payload };
    }
    case ActionType.SELECT_AS_HEDRON_TARGET: {
      const payload = validateSelectAsHedronTargetAction(data, gameModel);
      return { type: ActionType.SELECT_AS_HEDRON_TARGET, payload };
    }
    default: {
      throw new Error('Invalid action type');
    }
  }
};
