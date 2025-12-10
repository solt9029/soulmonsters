import { GameEntity } from 'src/entities/game.entity';
import { GameUserEntity } from 'src/entities/game-user.entity';

const calcNewEnergy = (gameEntity: GameEntity, userId: string): number => {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId)!;
  return Math.min(gameUser.energy + 2, 8);
};

export const increaseGameUserEnergy = (gameEntity: GameEntity, userId: string): GameEntity => {
  const newEnergy = calcNewEnergy(gameEntity, userId);

  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserEntity({ ...gameUser, energy: newEnergy }) : gameUser,
  );

  return gameEntity;
};
