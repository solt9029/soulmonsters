import { Phase, ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { GameUserEntity } from 'src/entities/game-user.entity';

export function grantStartBattleTimeAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({
          ...gameUser,
          actionTypes: [ActionType.START_BATTLE_TIME],
        })
      : gameUser,
  );
}
