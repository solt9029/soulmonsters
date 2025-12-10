import { GameCardEntity } from 'src/entities/game-card.entity';
import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';

const calcTopDeckGameCardId = (gameEntity: GameEntity, userId: string): number | undefined => {
  const deckGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.DECK && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return deckGameCards[0]?.id;
};

const calcNewHandGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const handGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.HAND && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return handGameCards[0] ? handGameCards[0].position + 1 : 0;
};

export const drawCardFromDeck = (gameEntity: GameEntity, userId: string): GameEntity => {
  const topDeckGameCardId = calcTopDeckGameCardId(gameEntity, userId);

  if (topDeckGameCardId === undefined) {
    return gameEntity;
  }

  const newPosition = calcNewHandGameCardPosition(gameEntity, userId);

  gameEntity.gameCards = gameEntity.gameCards.map(gameCard =>
    gameCard.id === topDeckGameCardId
      ? new GameCardEntity({
          ...gameCard,
          zone: Zone.HAND,
          position: newPosition,
        })
      : gameCard,
  );

  return gameEntity;
};
