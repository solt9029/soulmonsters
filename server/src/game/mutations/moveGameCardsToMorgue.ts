import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone } from 'src/graphql';
import { handleEvent } from 'src/game/events/handlers';
import { GameEventType } from 'src/game/events';
import { calcNewMorgueGameCardPosition } from 'src/game/selectors/calcNewMorgueGameCardPosition';

export const moveGameCardsToMorgue = (gameModel: GameModel, userId: string, gameCards: GameCardModel[]): GameModel => {
  const firstPosition = calcNewMorgueGameCardPosition(gameModel, userId);

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const costGameCardIndex = gameCards.findIndex(c => c.id === gameCard.id);

    if (costGameCardIndex === -1) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      zone: Zone.MORGUE,
      position: firstPosition + costGameCardIndex,
      battlePosition: null,
    });
  });

  gameCards.forEach(costGameCard => {
    gameModel = handleEvent(
      {
        type: GameEventType.ZONE_CHANGED,
        gameCardId: costGameCard.id,
        fromZone: costGameCard.zone,
        toZone: Zone.MORGUE,
      },
      gameModel,
    );
  });

  return gameModel;
};
