import { GameCardModel } from '../../../../models/game-card.model';
import { GameModel } from '../../../../models/game.model';
import { Zone } from '../../../../graphql/index';

export function packHandPositions(gameModel: GameModel, userId: string, removedPosition: number): GameModel {
  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.zone === Zone.HAND && gameCard.currentUserId === userId && gameCard.position > removedPosition
      ? new GameCardModel({
          ...gameCard,
          position: gameCard.position - 1,
        })
      : gameCard,
  );

  return gameModel;
}
