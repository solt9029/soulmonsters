import { GameCardEntity } from 'src/entities/game-card.entity';
import { GameModel } from 'src/models/game.model';
import { Zone } from 'src/graphql';

const calcTopDeckGameCardId = (gameModel: GameModel, userId: string): number | undefined => {
  const deckGameCards = gameModel.gameCards
    .filter(value => value.zone === Zone.DECK && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return deckGameCards[0]?.id;
};

const calcNewHandGameCardPosition = (gameModel: GameModel, userId: string): number => {
  const handGameCards = gameModel.gameCards
    .filter(value => value.zone === Zone.HAND && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return handGameCards[0] ? handGameCards[0].position + 1 : 0;
};

export const drawCardFromDeck = (gameModel: GameModel, userId: string): GameModel => {
  const topDeckGameCardId = calcTopDeckGameCardId(gameModel, userId);

  if (topDeckGameCardId === undefined) {
    return gameModel;
  }

  const newPosition = calcNewHandGameCardPosition(gameModel, userId);

  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.id === topDeckGameCardId
      ? new GameCardEntity({
          ...gameCard,
          zone: Zone.HAND,
          position: newPosition,
        })
      : gameCard,
  );

  return gameModel;
};
