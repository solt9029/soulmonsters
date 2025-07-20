import { GameEntity } from 'src/entities/game.entity';

export const subtractUserEnergy = (gameEntity: GameEntity, userId: string, amount: number): GameEntity => {
  const gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId ? { ...gameUser, energy: gameUser.energy - amount } : { ...gameUser },
  );
  return { ...gameEntity, gameUsers };
};
