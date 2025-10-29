import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectRuteruteDraw/saveEffectUseCountGameState';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
import { EffectRuteruteDrawValidationResult } from '../validators/effectRuteruteDraw';

// Function overload for backward compatibility
export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
): Promise<void>;
export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  validationResult: EffectRuteruteDrawValidationResult,
  gameEntity: GameEntity,
): Promise<void>;
export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  dataOrValidationResult: GameActionDispatchInput | EffectRuteruteDrawValidationResult,
  gameEntity: GameEntity,
) {
  let gameCardId;

  if ('gameCard' in dataOrValidationResult) {
    // Using validation result
    ({ gameCardId } = dataOrValidationResult);
  } else {
    // Backward compatibility - using data
    gameCardId = dataOrValidationResult.payload.gameCardId!;
  }

  subtractUserEnergy(gameEntity, userId, 1);
  drawCardFromDeck(gameEntity, userId);
  saveEffectUseCountGameState(gameEntity, gameCardId);

  await manager.save(GameEntity, gameEntity);
}
