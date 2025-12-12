import { ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { GameUserModel } from 'src/models/game-user.model';

export function grantStartDrawTimeAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== null || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserModel({
          ...gameUser,
          actionTypes: [ActionType.START_DRAW_TIME],
        })
      : gameUser,
  );
}
