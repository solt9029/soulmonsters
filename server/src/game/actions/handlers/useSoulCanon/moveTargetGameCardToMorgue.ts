import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone } from 'src/graphql';
import { handleEvent } from 'src/game/events/handlers';
import { GameEventType } from 'src/game/events';
import { calcNewMorgueGameCardPosition } from 'src/game/utils/calcNewMorgueGameCardPosition';

export const moveTargetGameCardToMorgue = (gameModel: GameModel, targetGameCard: GameCardModel): GameModel => {
  const targetPreviousZone = targetGameCard.zone;

  gameModel.gameCards = gameModel.gameCards.map(gameCard =>
    gameCard.id === targetGameCard.id
      ? new GameCardModel({
          ...gameCard,
          zone: Zone.MORGUE,
          position: calcNewMorgueGameCardPosition(gameModel, targetGameCard.currentUserId),
          battlePosition: null,
        })
      : gameCard,
  );

  gameModel = handleEvent(
    {
      type: GameEventType.ZONE_CHANGED,
      gameCardId: targetGameCard.id,
      fromZone: targetPreviousZone,
      toZone: Zone.MORGUE,
    },
    gameModel,
  );

  return gameModel;
};
