import { Phase } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { GameUserEntity } from 'src/entities/game.user.entity';

const calcNewEnergy = (gameEntity: GameEntity, userId: string): number => {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId)!;
  return Math.min(gameUser.energy + 2, 8);
};

const increaseGameUserEnergy = (gameEntity: GameEntity, userId: string): GameEntity => {
  const newEnergy = calcNewEnergy(gameEntity, userId);

  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserEntity({ ...gameUser, energy: newEnergy }) : gameUser,
  );

  return gameEntity;
};

const startEnergyPhase = (gameEntity: GameEntity): GameEntity => {
  gameEntity.phase = Phase.ENERGY;
  return gameEntity;
};

export async function handleStartEnergyTimeAction(manager: EntityManager, userId: string, gameEntity: GameEntity) {
  increaseGameUserEnergy(gameEntity, userId);
  startEnergyPhase(gameEntity);

  await manager.save(GameEntity, gameEntity);
}
