import { Phase } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { GameModel } from 'src/models/game.model';

export async function handleStartBattleTimeAction(manager: EntityManager, gameModel: GameModel) {
  gameModel.phase = Phase.BATTLE;
  await manager.save( gameModel);
}
