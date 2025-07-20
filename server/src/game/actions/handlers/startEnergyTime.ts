import { Phase } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';

const calcNewEnergy = (gameEntity: GameEntity, userId: string): number => {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId)!;
  return Math.min(gameUser.energy + 2, 8);
};

const increaseGameUserEnergy = (gameEntity: GameEntity, userId: string): GameEntity => {
  const newEnergy = calcNewEnergy(gameEntity, userId);

  const gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId ? { ...gameUser, energy: newEnergy } : { ...gameUser },
  );

  return { ...gameEntity, gameUsers };
};

const startEnergyPhase = (gameEntity: GameEntity): GameEntity => {
  return { ...gameEntity, phase: Phase.ENERGY };
};

export async function handleStartEnergyTimeAction(
  manager: EntityManager,
  _id: number,
  userId: string,
  gameEntity: GameEntity,
) {
  gameEntity = increaseGameUserEnergy(gameEntity, userId);
  gameEntity = startEnergyPhase(gameEntity);

  await manager.save(GameEntity, gameEntity);
}
