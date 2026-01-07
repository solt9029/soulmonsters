import { GameModel } from 'src/models/game.model';
import { Zone } from 'src/graphql';

export const calcNewMorgueGameCardPosition = (gameModel: GameModel, userId: string): number => {
  const positions = gameModel.gameCards
    .filter(gameCard => gameCard.zone === Zone.MORGUE && gameCard.currentUserId === userId)
    .map(gameCard => gameCard.position);

  return positions.length > 0 ? Math.max(...positions) + 1 : 0;
};
