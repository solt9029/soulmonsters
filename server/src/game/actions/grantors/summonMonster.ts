import { Zone } from 'src/graphql';
import { Phase, Kind, ActionType } from 'src/graphql/index';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';

export function grantSummonMonsterAction(gameModel: GameModel, userId: string): GameModel {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    // memo: gameCard.kindに依存しているから、先にreflectStatesが呼ばれている前提である
    const canSummon =
      gameCard && gameCard.zone === Zone.HAND && gameCard.currentUserId === userId && gameCard.kind === Kind.MONSTER;

    return canSummon
      ? new GameCardModel({
          ...gameCard,
          actionTypes: [...gameCard.actionTypes, ActionType.SUMMON_MONSTER],
        })
      : gameCard;
  });

  return gameModel;
}
