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
import { SummonMonsterValidationResult } from '../validators/summonMonster';
import { EffectRuteruteDrawValidationResult } from '../validators/effectRuteruteDraw';

type ValidationResults = 
  | PutSoulValidationResult
  | AttackValidationResult
  | SummonMonsterValidationResult
  | EffectRuteruteDrawValidationResult;

// TODO: userIdよりもgameUserIdを受け取った方が便利かも？だけど、現状はgameCardがuserIdしか持っていないっぽいのでやや不便か？
// 理想メモ: game, gameUserId, opponentGameUser, data, manager
export async function handleAction(
  data: GameActionDispatchInput,
  manager: EntityManager,
  userId: string,
  gameEntity: GameEntity,
) {
  switch (data.type) {
    case ActionType.START_DRAW_TIME:
      return await handleStartDrawTimeAction(manager, userId, gameEntity);
    case ActionType.START_ENERGY_TIME:
      return await handleStartEnergyTimeAction(manager, userId, gameEntity);
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
      return await handleFinishEndTimeAction(manager, userId, gameEntity);
    case ActionType.EFFECT_RUTERUTE_DRAW:
      return await handleEffectRuteruteDraw(manager, userId, data, gameEntity);
    default:
      return;
  }
}

export async function handleActionWithValidation(
  manager: EntityManager,
  userId: string,
  validationResult: ValidationResults,
  gameEntity: GameEntity,
) {
  // 型ガードを使って適切なハンドラーを呼び出し
  if ('gameCard' in validationResult && 'gameUser' in validationResult) {
    // 全ての ValidationResult に共通のプロパティで判別
    const gameCard = validationResult.gameCard;
    const actionType = gameCard.actionTypes.find(type => 
      type === ActionType.PUT_SOUL || 
      type === ActionType.ATTACK || 
      type === ActionType.SUMMON_MONSTER || 
      type === ActionType.EFFECT_RUTERUTE_DRAW
    );

    switch (actionType) {
      case ActionType.PUT_SOUL:
        return await handlePutSoulAction(manager, userId, validationResult as PutSoulValidationResult, gameEntity);
      case ActionType.ATTACK:
        return await handleAttackAction(manager, userId, validationResult as AttackValidationResult, gameEntity);
      case ActionType.SUMMON_MONSTER:
        return await handleSummonMonsterAction(manager, userId, validationResult as SummonMonsterValidationResult, gameEntity);
      case ActionType.EFFECT_RUTERUTE_DRAW:
        return await handleEffectRuteruteDraw(manager, userId, validationResult as EffectRuteruteDrawValidationResult, gameEntity);
      default:
        throw new Error(`Unsupported action type: ${actionType}`);
    }
  }
  
  throw new Error('Invalid validation result format');
}
