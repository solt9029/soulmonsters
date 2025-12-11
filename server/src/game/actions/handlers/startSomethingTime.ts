import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameModel } from 'src/models/game.model';

export async function handleStartSomethingTimeAction(manager: EntityManager, gameModel: GameModel) {
  gameModel.phase = Phase.SOMETHING;
  await manager.save(gameModel);
}
