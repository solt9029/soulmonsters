import { GameEntity } from '../../../../entities/game.entity';
import { MAX_ENERGY } from '../../../../constants/rule';
import { GameUserEntity } from 'src/entities/game-user.entity';

export const increaseEnergyToPlayer = (gameEntity: GameEntity, userId: string): GameEntity => {
  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({ ...gameUser, energy: Math.min(gameUser.energy + 1, MAX_ENERGY) })
      : gameUser,
  );

  return gameEntity;
};
