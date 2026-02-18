import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { Zone } from 'src/graphql';
import { handleEvent } from '../events/handlers';
import { GameEventType } from '../events';

const calcNewSoulGameCardPosition = (gameModel: GameModel, userId: string): number => {
  const soulGameCards = gameModel.gameCards
    .filter(gameCard => gameCard.zone === Zone.SOUL && gameCard.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards[0] ? soulGameCards[0].position + 1 : 0;
};

export const moveGameCardToSoul = (gameModel: GameModel, userId: string, gameCardId: number): GameModel => {
  const gameCard = gameModel.gameCards.find(gameCard => gameCard.id === gameCardId);
  if (!gameCard) {
    throw new Error('Card not found');
  }

  const previousZone = gameCard.zone;

  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? new GameCardModel({
          ...gameCard,
          zone: Zone.SOUL,
          position: calcNewSoulGameCardPosition(gameModel, userId),
        })
      : gameCard,
  );

  gameModel = handleEvent(
    {
      type: GameEventType.ZONE_CHANGED,
      gameCardId,
      fromZone: previousZone,
      toZone: Zone.SOUL,
    },
    gameModel,
  );

  return gameModel;
};
