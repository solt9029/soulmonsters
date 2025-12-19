import { GameEvent, GameEventType } from '..';
import { GameModel } from '../../../models/game.model';
import { handleZoneChanged } from './zoneChanged';

export function handleGameEvent(event: GameEvent, gameModel: GameModel): GameModel {
  switch (event.type) {
    case GameEventType.ZONE_CHANGED:
      return handleZoneChanged(event, gameModel);
    default:
      return gameModel;
  }
}
