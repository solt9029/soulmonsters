import { GameEntity } from 'src/entities/game.entity';
import { GameUserEntity } from 'src/entities/game.user.entity';

export const switchToOpponentTurn = (gameEntity: GameEntity, opponentGameUser: GameUserEntity): GameEntity => {
  gameEntity.phase = null;
  gameEntity.turnUserId = opponentGameUser.userId;

  return gameEntity;
};
