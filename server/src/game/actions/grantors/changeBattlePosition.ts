import { GameModel } from '../../../models/game.model';
import { Zone } from 'src/graphql';
import { Phase, ActionType } from '../../../graphql/index';
import { GameCardModel } from 'src/models/game-card.model';

export function grantChangeBattlePositionAction(gameModel: GameModel, userId: string): GameModel {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const canChangeBattlePosition = gameCard.zone === Zone.BATTLE && gameCard.currentUserId === userId;

    return canChangeBattlePosition
      ? new GameCardModel({
          ...gameCard,
          actionTypes: [...gameCard.actionTypes, ActionType.CHANGE_BATTLE_POSITION],
        })
      : gameCard;
  });

  return gameModel;
}
