import { GameModel } from 'src/models/game.model';
import { GameUserEntity } from 'src/entities/game-user.entity';

export const switchToOpponentTurn = (gameModel: GameModel, opponentGameUser: GameUserEntity): GameModel => {
  gameModel.phase = null;
  gameModel.turnUserId = opponentGameUser.userId;

  return gameModel;
};
