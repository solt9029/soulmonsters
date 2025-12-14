import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { putSoulGameCard } from './putSoul/putSoulGameCard';
import { savePutCountGameState } from './putSoul/savePutCountGameState';
import { packHandPositions } from './putSoul/packHandPositions';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';

export type PutSoulActionPayload = {
  gameCard: GameCardModel;
  gameUser: GameUserModel;
};

export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  payload: PutSoulActionPayload,
  gameModel: GameModel,
) {
  const originalPosition = payload.gameCard.position;

  gameModel = putSoulGameCard(gameModel, userId, payload.gameCard.id);
  gameModel = packHandPositions(gameModel, userId, originalPosition);
  gameModel = savePutCountGameState(gameModel, payload.gameUser.id);
  await manager.save(gameModel.toEntity());
}
