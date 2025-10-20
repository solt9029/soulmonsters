import { GameEntity } from 'src/entities/game.entity';
import { GameUserEntity } from 'src/entities/game.user.entity';

export const subtractUserEnergy = (gameEntity: GameEntity, userId: string, amount: number): GameEntity => {
  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId ? new GameUserEntity({ ...gameUser, energy: gameUser.energy - amount }) : gameUser,
  );

  return gameEntity;
};
