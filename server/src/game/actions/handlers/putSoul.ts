import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { putSoulGameCard } from './putSoul/putSoulGameCard';
import { savePutCountGameState } from './putSoul/savePutCountGameState';
import { PutSoulValidationResult } from '../validators/putSoul';

// Function overload for backward compatibility
export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
): Promise<void>;
export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  validationResult: PutSoulValidationResult,
  gameEntity: GameEntity,
): Promise<void>;
export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  dataOrValidationResult: GameActionDispatchInput | PutSoulValidationResult,
  gameEntity: GameEntity,
) {
  let gameCard, gameUser, gameCardId, originalPosition;

  if ('gameCard' in dataOrValidationResult) {
    // Using validation result
    ({ gameCard, gameUser, gameCardId } = dataOrValidationResult);
    originalPosition = gameCard.position;
  } else {
    // Backward compatibility - using data
    gameCard = gameEntity.gameCards.find(value => value.id === dataOrValidationResult.payload.gameCardId)!;
    originalPosition = gameCard.position;
    gameUser = gameEntity.gameUsers.find(value => value.userId === userId)!;
    gameCardId = dataOrValidationResult.payload.gameCardId!;
  }

  putSoulGameCard(gameEntity, userId, gameCardId);
  savePutCountGameState(gameEntity, gameUser.id);
  await manager.save(GameEntity, gameEntity);

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
}
