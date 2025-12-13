import { GameCardRepository } from '../../../repositories/game-card.repository';
import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { putSoulGameCard } from './putSoul/putSoulGameCard';
import { savePutCountGameState } from './putSoul/savePutCountGameState';
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

  putSoulGameCard(gameModel, userId, payload.gameCard.id);
  savePutCountGameState(gameModel, payload.gameUser.id);
  await manager.save(gameModel.toEntity());

  // 本当は new GameCardRepository のタイミングで connection を渡す必要は実際はない（packHandPositionsで別途managerを渡すから）。ただし、渡さないといけないから仕方なく渡している。仕方なく渡しているmanager.connectionが使われてしまうとまずいので（別のentityManagerが生成されてしまう）、必ずpackHandPositionsではmanagerを渡すように！！
  const gameCardRepository = new GameCardRepository(manager.connection);
  await gameCardRepository.packHandPositions(gameModel.id, userId, originalPosition, manager);
}
