import { Zone } from 'src/graphql';
import { Phase, Kind, ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { GameCardModel } from 'src/models/game-card.model';

export function grantSummonMonsterAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const canSummon =
      gameCard && gameCard.zone === Zone.HAND && gameCard.currentUserId === userId && gameCard.kind === Kind.MONSTER;

    return canSummon
      ? new GameCardModel({
          ...gameCard,
          actionTypes: [...gameCard.actionTypes, ActionType.SUMMON_MONSTER],
        })
      : gameCard;
  });
}
