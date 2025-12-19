import { ZoneChangedEvent } from '..';
import { GameModel } from '../../../models/game.model';
import { Zone } from '../../../graphql';
import { addUserEnergy } from './zoneChanged/addUserEnergy';

export function handleZoneChanged(event: ZoneChangedEvent, gameModel: GameModel): GameModel {
  if (event.fromZone !== Zone.BATTLE || event.toZone !== Zone.SOUL) {
    return gameModel;
  }

  const movedCard = gameModel.gameCards.find(gc => gc.id === event.gameCardId);
  if (!movedCard || !movedCard.card) {
    return gameModel;
  }

  if (movedCard.card.id === 14) {
    gameModel = addUserEnergy(gameModel, movedCard.currentUserId, 2);
  }

  return gameModel;
}
