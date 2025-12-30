import { GameModel } from 'src/models/game.model';
import { Zone, ActionType, Phase } from 'src/graphql/index';
import { GameUserModel } from 'src/models/game-user.model';

export function grantUseSoulCanonAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  const soulGameCardCount = gameModel.gameCards.filter(
    gameCard => gameCard.currentUserId === userId && gameCard.zone === Zone.SOUL,
  ).length;

  if (soulGameCardCount < 4) {
    return gameModel;
  }

  gameModel.gameUsers = gameModel.gameUsers.map(gameUser => {
    if (gameUser.userId !== userId) {
      return gameUser;
    }

    return new GameUserModel({
      ...gameUser,
      actionTypes: [...gameUser.actionTypes, ActionType.USE_SOUL_CANON],
    });
  });

  return gameModel;
}
