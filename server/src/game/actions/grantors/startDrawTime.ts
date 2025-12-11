import { ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { GameUserEntity } from 'src/entities/game-user.entity';

export function grantStartDrawTimeAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== null || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({
          ...gameUser,
          actionTypes: [ActionType.START_DRAW_TIME],
        })
      : gameUser,
  );
}
