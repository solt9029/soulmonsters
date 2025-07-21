import { GameEntity } from 'src/entities/game.entity';

export const subtractUserEnergy = (gameEntity: GameEntity, userId: string, amount: number): GameEntity => {
  const index = gameEntity.gameUsers.findIndex(gameUser => gameUser.userId === userId);

  gameEntity.gameUsers[index].energy -= amount;

  return gameEntity;
};
