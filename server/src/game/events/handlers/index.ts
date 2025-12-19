import { GameEvent, GameEventType } from '..';
import { GameModel } from '../../../models/game.model';
import { handleZoneChanged } from './zoneChanged';
import { handleDirectAttack } from './directAttack';

export function handleEvent(event: GameEvent, gameModel: GameModel): GameModel {
  switch (event.type) {
    case GameEventType.ZONE_CHANGED:
      return handleZoneChanged(event, gameModel);
    case GameEventType.DIRECT_ATTACK:
      return handleDirectAttack(event, gameModel);
    default:
      return gameModel;
  }
}
