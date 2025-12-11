import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameModel } from 'src/models/game.model';

export async function handleStartEndTimeAction(manager: EntityManager, gameModel: GameModel) {
  gameModel.phase = Phase.END;
  await manager.save(gameModel);
}
