import { GameModel } from '../../../models/game.model';
import { increaseGameUserEnergy } from '../../mutations/startEnergyTime/increaseGameUserEnergy';
import { Phase } from 'src/graphql';

export function handleStartEnergyTimeAction(userId: string, gameModel: GameModel): GameModel {
  gameModel = increaseGameUserEnergy(gameModel, userId);
  gameModel.phase = Phase.ENERGY;
  return gameModel;
}
