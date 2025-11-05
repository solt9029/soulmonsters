import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { putSoulGameCard } from './putSoul/putSoulGameCard';
import { savePutCountGameState } from './putSoul/savePutCountGameState';
import { PutSoulValidationResult } from '../validators/putSoul';

export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  validationResult: PutSoulValidationResult,
  gameEntity: GameEntity,
) {
  const { gameCard, gameUser, gameCardId } = validationResult;
  const originalPosition = gameCard.position;

  putSoulGameCard(gameEntity, userId, gameCardId);
  savePutCountGameState(gameEntity, gameUser.id);
  await manager.save(GameEntity, gameEntity);

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
}
