import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { startEnergyPhase } from './startEnergyTime/startEnergyPhase';
import { increaseGameUserEnergy } from './startEnergyTime/increaseGameUserEnergy';

export async function handleStartEnergyTimeAction(manager: EntityManager, userId: string, gameModel: GameModel) {
  increaseGameUserEnergy(gameModel, userId);
  startEnergyPhase(gameModel);

  await manager.save( gameModel);
}
