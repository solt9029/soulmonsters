import { GameModel } from '../../../../models/game.model';
import { Zone } from '../../../../graphql/index';

export function packHandPositions(gameModel: GameModel, userId: string, removedPosition: number) {
  gameModel.gameCards
    .filter(card => card.zone === Zone.HAND && card.currentUserId === userId && card.position > removedPosition)
    .forEach(card => {
      card.position = card.position - 1;
    });
}
