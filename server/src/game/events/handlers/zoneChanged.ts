import { ZoneChangedEvent } from '..';
import { GameModel } from '../../../models/game.model';
import { Zone } from '../../../graphql';
import { addUserEnergy } from '../../mutations/addUserEnergy';
import { subtractUserEnergy } from '../../mutations/subtractUserEnergy';
import { dealDamageToPlayer } from '../../mutations/dealDamageToPlayer';
import { CARD_ID } from '../../../constants/card';

export function handleZoneChanged(event: ZoneChangedEvent, gameModel: GameModel): GameModel {
  const movedCard = gameModel.gameCards.find(gc => gc.id === event.gameCardId);
  if (!movedCard || !movedCard.card) {
    return gameModel;
  }

  if (event.toZone === Zone.BATTLE && movedCard.card.id === CARD_ID.SHIMASHIMAJUNIOR) {
    const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== movedCard.currentUserId)?.userId;
    if (opponentUserId) {
      gameModel = subtractUserEnergy(gameModel, opponentUserId, 1);
      gameModel = addUserEnergy(gameModel, movedCard.currentUserId, 1);
    }
  }

  if (event.fromZone === Zone.BATTLE && event.toZone === Zone.SOUL && movedCard.card.id === CARD_ID.NISEKISANCHOU) {
    gameModel = addUserEnergy(gameModel, movedCard.currentUserId, 2);
  }

  if (
    event.fromZone === Zone.BATTLE &&
    event.toZone === Zone.SOUL &&
    movedCard.card.id === CARD_ID.SHINKASHITABAKUBOMDAN
  ) {
    const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== movedCard.currentUserId)?.userId;
    if (opponentUserId) {
      gameModel = dealDamageToPlayer(gameModel, opponentUserId, 600);
    }
  }

  if (event.toZone === Zone.MORGUE && movedCard.card.id === CARD_ID.AIKAWARAZUYOKUWAKARANAIHANA) {
    const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== movedCard.currentUserId)?.userId;
    if (opponentUserId) {
      gameModel = dealDamageToPlayer(gameModel, opponentUserId, 600);
    }
  }

  return gameModel;
}
