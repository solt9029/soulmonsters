import { GameEvent, GameEventType, ZoneChangedEvent } from '../../events';
import { GameModel } from '../../../models/game.model';
import { Zone } from '../../../graphql';
import { addUserEnergy } from './addUserEnergy';

export function handleGameEvent(event: GameEvent, gameModel: GameModel): GameModel {
  if (event.type === GameEventType.ZONE_CHANGED) {
    return handleZoneChanged(event, gameModel);
  }

  return gameModel;
}

function handleZoneChanged(event: ZoneChangedEvent, gameModel: GameModel): GameModel {
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
