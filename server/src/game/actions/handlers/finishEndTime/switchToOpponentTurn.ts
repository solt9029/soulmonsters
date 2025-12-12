import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';

export const switchToOpponentTurn = (gameModel: GameModel, opponentGameUser: GameUserModel): GameModel => {
  gameModel.phase = null;
  gameModel.turnUserId = opponentGameUser.userId;

  return gameModel;
};
