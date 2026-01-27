import { ZoneChangedEvent } from '..';
import { GameModel } from 'src/models/game.model';
import { GamePendingEffectModel } from 'src/models/game-pending-effect.model';
import { EffectType, Zone } from 'src/graphql';
import { addUserEnergy } from 'src/game/mutations/addUserEnergy';
import { dealDamageToPlayer } from 'src/game/mutations/dealDamageToPlayer';
import { CARD_ID } from 'src/constants/card';

export function handleZoneChanged(event: ZoneChangedEvent, gameModel: GameModel): GameModel {
  const movedCard = gameModel.gameCards.find(gc => gc.id === event.gameCardId);
  if (!movedCard || !movedCard.card) {
    return gameModel;
  }

  if (event.toZone === Zone.BATTLE && movedCard.card.id === CARD_ID.SHIMASHIMAJUNIOR) {
    const gamePendingEffect = new GamePendingEffectModel({
      gameId: gameModel.id,
      userId: movedCard.currentUserId,
      gameCardId: movedCard.id,
      effectType: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER,
      createdAt: new Date(),
    });
    gameModel.gamePendingEffects = [...gameModel.gamePendingEffects, gamePendingEffect];
  }

  if (event.fromZone === Zone.BATTLE && event.toZone === Zone.SOUL && movedCard.card.id === CARD_ID.NISEKISANCHOU) {
    gameModel = addUserEnergy(gameModel, movedCard.currentUserId, 2);
  }

  if (
    event.fromZone === Zone.BATTLE &&
    event.toZone === Zone.SOUL &&
    movedCard.card.id === CARD_ID.SHINKASHITABAKUBOMDAN
  ) {
    const gamePendingEffect = new GamePendingEffectModel({
      gameId: gameModel.id,
      userId: movedCard.currentUserId,
      gameCardId: movedCard.id,
      effectType: EffectType.SHINKASHITABAKUBOMDAN_DAMAGE,
      createdAt: new Date(),
    });
    gameModel.gamePendingEffects = [...gameModel.gamePendingEffects, gamePendingEffect];
  }

  if (event.toZone === Zone.MORGUE && movedCard.card.id === CARD_ID.AIKAWARAZUYOKUWAKARANAIHANA) {
    const opponentUserId = gameModel.gameUsers.find(gu => gu.userId !== movedCard.currentUserId)?.userId;
    if (opponentUserId) {
      gameModel = dealDamageToPlayer(gameModel, opponentUserId, 600);
    }
  }

  return gameModel;
}
