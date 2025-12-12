import { GameModel } from '../../../models/game.model';
import { Phase, ActionType } from '../../../graphql/index';
import { GameUserModel } from 'src/models/game-user.model';

export function grantFinishEndTimeAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.END || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserModel({
          ...gameUser,
          actionTypes: [ActionType.FINISH_END_TIME],
        })
      : gameUser,
  );
}
