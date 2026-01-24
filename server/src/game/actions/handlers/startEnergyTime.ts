import { GameModel } from '../../../models/game.model';
import { startEnergyPhase } from '../../mutations/startEnergyTime/startEnergyPhase';
import { increaseGameUserEnergy } from '../../mutations/startEnergyTime/increaseGameUserEnergy';

export function handleStartEnergyTimeAction(userId: string, gameModel: GameModel): GameModel {
  increaseGameUserEnergy(gameModel, userId);
  startEnergyPhase(gameModel);
  return gameModel;
}
