import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectRuteruteDraw/saveEffectUseCountGameState';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
import { EffectRuteruteDrawValidationResult } from '../validators/effectRuteruteDraw';

// New validation result version
export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  validationResult: EffectRuteruteDrawValidationResult,
  gameEntity: GameEntity,
): Promise<void>;

// Legacy data version for backward compatibility
export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
): Promise<void>;

// Implementation
export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  dataOrValidationResult: GameActionDispatchInput | EffectRuteruteDrawValidationResult,
  gameEntity: GameEntity,
) {
  // Check if it's validation result or legacy data
  if ('gameCard' in dataOrValidationResult && 'gameUser' in dataOrValidationResult && 'gameCardId' in dataOrValidationResult && !('attackTarget' in dataOrValidationResult)) {
    // New validation result approach
    const validationResult = dataOrValidationResult as EffectRuteruteDrawValidationResult;
    const { gameCard, gameCardId, gameUser } = validationResult;

    subtractUserEnergy(gameEntity, userId, 1);
    drawCardFromDeck(gameEntity, userId);
    saveEffectUseCountGameState(gameEntity, gameCardId);

    await manager.save(GameEntity, gameEntity);
  } else {
    // Legacy data approach
    const data = dataOrValidationResult as GameActionDispatchInput;
    
    subtractUserEnergy(gameEntity, userId, 1);
    drawCardFromDeck(gameEntity, userId);
    saveEffectUseCountGameState(gameEntity, data.payload.gameCardId!);

    await manager.save(GameEntity, gameEntity);
  }
}
