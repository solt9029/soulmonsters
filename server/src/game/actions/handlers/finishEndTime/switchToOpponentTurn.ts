import { GameEntity } from 'src/entities/game.entity';

export const switchToOpponentTurn = (gameEntity: GameEntity, userId: string): GameEntity => {
  const opponentGameUser = gameEntity.gameUsers.find(value => value.userId !== userId);

  if (!opponentGameUser) {
    throw new Error('Opponent game user not found');
  }

  gameEntity.phase = null;
  gameEntity.turnUserId = opponentGameUser.userId;

  return gameEntity;
};
