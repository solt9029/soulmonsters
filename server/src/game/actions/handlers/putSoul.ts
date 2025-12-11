import { GameCardRepository } from '../../../repositories/game-card.repository';
import { GameModel } from '../../../models/game.model';
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
  gameModel: GameModel,
) {
  const originalPosition = payload.gameCard.position;

  putSoulGameCard(gameModel, userId, payload.gameCard.id);
  savePutCountGameState(gameModel, payload.gameUser.id);
  await manager.save(gameModel);

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameModel.id, userId, originalPosition);
}
