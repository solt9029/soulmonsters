import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { startEnergyPhase } from './startEnergyTime/startEnergyPhase';
import { increaseGameUserEnergy } from './startEnergyTime/increaseGameUserEnergy';

export async function handleStartEnergyTimeAction(manager: EntityManager, userId: string, gameEntity: GameEntity) {
  increaseGameUserEnergy(gameEntity, userId);
  startEnergyPhase(gameEntity);

  await manager.save(GameEntity, gameEntity);
}
