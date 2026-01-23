import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone } from 'src/graphql';
import { handleEvent } from 'src/game/events/handlers';
import { GameEventType } from 'src/game/events';
import { calcNewMorgueGameCardPosition } from 'src/game/selectors/calcNewMorgueGameCardPosition';

export const moveTargetMonsterToMorgue = (gameModel: GameModel, targetGameCard: GameCardModel): GameModel => {
  const newPosition = calcNewMorgueGameCardPosition(gameModel, targetGameCard.currentUserId);

  gameModel.gameCards = gameModel.gameCards.map(gc => {
    if (gc.id === targetGameCard.id) {
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
      gameCardId: targetGameCard.id,
      fromZone: targetGameCard.zone,
      toZone: Zone.MORGUE,
    },
    gameModel,
  );

  return gameModel;
};
