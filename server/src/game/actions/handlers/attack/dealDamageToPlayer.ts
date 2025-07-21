import { GameEntity } from '../../../../entities/game.entity';

export const dealDamageToPlayer = (gameEntity: GameEntity, userId: string, damage: number): GameEntity => {
  const userIndex = gameEntity.gameUsers.findIndex(gameUser => gameUser.userId === userId);

  if (userIndex === -1) {
    throw new Error('Game user not found');
  }

  gameEntity.gameUsers[userIndex].lifePoint -= damage;

  return gameEntity;
};
