import { GameModel } from 'src/models/game.model';
import { addUserEnergy } from 'src/game/mutations/addUserEnergy';
import { Phase } from 'src/graphql';

export function handleStartEnergyTimeAction(userId: string, gameModel: GameModel): GameModel {
  gameModel = addUserEnergy(gameModel, userId, 2);
  gameModel.phase = Phase.ENERGY;
  return gameModel;
}
