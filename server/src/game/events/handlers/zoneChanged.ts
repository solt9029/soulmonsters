import { ZoneChangedEvent } from '..';
import { GameModel } from '../../../models/game.model';
import { Zone } from '../../../graphql';
import { addUserEnergy } from './zoneChanged/addUserEnergy';
import { subtractUserEnergy } from './zoneChanged/subtractUserEnergy';

export function handleZoneChanged(event: ZoneChangedEvent, gameModel: GameModel): GameModel {
  const movedCard = gameModel.gameCards.find(gc => gc.id === event.gameCardId);
  if (!movedCard || !movedCard.card) {
    return gameModel;
  }

  if (event.toZone === Zone.BATTLE && movedCard.card.id === 13) {
    const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== movedCard.currentUserId)?.userId;
    if (opponentUserId) {
      gameModel = subtractUserEnergy(gameModel, opponentUserId, 1);
      gameModel = addUserEnergy(gameModel, movedCard.currentUserId, 1);
    }
  }

  if (event.fromZone === Zone.BATTLE && event.toZone === Zone.SOUL && movedCard.card.id === 14) {
    gameModel = addUserEnergy(gameModel, movedCard.currentUserId, 2);
  }

  return gameModel;
}
