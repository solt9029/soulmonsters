import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameModel } from '../../../models/game.model';

export async function handleStartPutTimeAction(manager: EntityManager, gameModel: GameModel) {
  gameModel.phase = Phase.PUT;
  await manager.save(gameModel);
}
