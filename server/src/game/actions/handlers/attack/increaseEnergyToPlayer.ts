import { GameEntity } from '../../../../entities/game.entity';
import { MAX_ENERGY } from '../../../../constants/rule';

export const increaseEnergyToPlayer = (gameEntity: GameEntity, userId: string): GameEntity => {
  const userIndex = gameEntity.gameUsers.findIndex(gameUser => gameUser.userId === userId);

  if (userIndex === -1) {
    throw new Error('Game user not found');
  }

  if (gameEntity.gameUsers[userIndex].energy < MAX_ENERGY) {
    gameEntity.gameUsers[userIndex].energy += 1;
  }

  return gameEntity;
};
