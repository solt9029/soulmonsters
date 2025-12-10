import { GameCardRepository } from '../../../repositories/game-card.repository';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { putSoulGameCard } from './putSoul/putSoulGameCard';
import { savePutCountGameState } from './putSoul/savePutCountGameState';
import { GameCardEntity } from 'src/entities/game-card.entity';
import { GameUserEntity } from 'src/entities/game-user.entity';

export type PutSoulActionPayload = {
  gameCard: GameCardEntity;
  gameUser: GameUserEntity;
};

export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  payload: PutSoulActionPayload,
  gameEntity: GameEntity,
) {
  const originalPosition = payload.gameCard.position;

  putSoulGameCard(gameEntity, userId, payload.gameCard.id);
  savePutCountGameState(gameEntity, payload.gameUser.id);
  await manager.save(GameEntity, gameEntity);

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
}
