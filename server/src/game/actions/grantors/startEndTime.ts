import { GameModel } from '../../../models/game.model';
import { Phase, ActionType } from '../../../graphql/index';
import { GameUserModel } from 'src/models/game-user.model';

export function grantStartEndTimeAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.BATTLE || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserModel({
          ...gameUser,
          actionTypes: [ActionType.START_END_TIME],
        })
      : gameUser,
  );
}
