import { ActionType, Phase } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { GameUserModel } from 'src/models/game-user.model';

export function grantStartSomethingTimeAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.PUT || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserModel({
          ...gameUser,
          actionTypes: [...gameUser.actionTypes, ActionType.START_SOMETHING_TIME],
        })
      : gameUser,
  );
}
