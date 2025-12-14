import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { Zone } from 'src/graphql/index';

export function packBattleZonePositions(gameModel: GameModel, userId: string, removedPosition: number): GameModel {
  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.zone === Zone.BATTLE && gameCard.currentUserId === userId && gameCard.position > removedPosition
      ? new GameCardModel({
          ...gameCard,
          position: gameCard.position - 1,
        })
      : gameCard,
  );

  return gameModel;
}
