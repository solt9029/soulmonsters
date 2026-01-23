import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone } from 'src/graphql';
import { handleEvent } from 'src/game/events/handlers';
import { GameEventType } from 'src/game/events';

import { calcNewMorgueGameCardPosition } from 'src/game/selectors/calcNewMorgueGameCardPosition';

export const moveDeckTopCardToMorgue = (gameModel: GameModel, userId: string): GameModel => {
  const deckCards = gameModel.gameCards
    .filter(gc => gc.currentUserId === userId && gc.zone === Zone.DECK)
    .sort((a, b) => a.position - b.position);

  const topCard = deckCards[0];

  if (!topCard) {
    return gameModel;
  }

  const newPosition = calcNewMorgueGameCardPosition(gameModel, userId);

  gameModel.gameCards = gameModel.gameCards.map(gc => {
    if (gc.id === topCard.id) {
      return new GameCardModel({
        ...gc,
        zone: Zone.MORGUE,
        position: newPosition,
        battlePosition: null,
      });
    }
    return gc;
  });

  gameModel = handleEvent(
    {
      type: GameEventType.ZONE_CHANGED,
      gameCardId: topCard.id,
      fromZone: topCard.zone,
      toZone: Zone.MORGUE,
    },
    gameModel,
  );

  return gameModel;
};
