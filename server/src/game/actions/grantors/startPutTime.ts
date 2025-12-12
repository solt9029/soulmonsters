import { GameModel } from '../../../models/game.model';
import { Phase, ActionType } from '../../../graphql/index';
import { GameUserEntity } from 'src/entities/game-user.entity';

export function grantStartPutTimeAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.ENERGY || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({
          ...gameUser,
          actionTypes: [ActionType.START_PUT_TIME],
        })
      : gameUser,
  );
}
