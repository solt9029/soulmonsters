import { GameEntity } from 'src/entities/game.entity';

export const switchToOpponentTurn = (gameEntity: GameEntity, userId: string): GameEntity => {
  const opponentGameUser = gameEntity.gameUsers.find(value => value.userId !== userId)!;

  gameEntity.phase = null;
  gameEntity.turnUserId = opponentGameUser.userId;

  return gameEntity;
};
