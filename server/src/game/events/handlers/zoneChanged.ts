import { ZoneChangedEvent } from '..';
import { GameModel } from 'src/models/game.model';
import { GamePendingEffectModel } from 'src/models/game-pending-effect.model';
import { EffectType, Zone } from 'src/graphql';
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
    const gamePendingEffect = new GamePendingEffectModel({
      gameId: gameModel.id,
      userId: movedCard.currentUserId,
      gameCardId: movedCard.id,
      effectType: EffectType.NISEKISANCHOU_ENERGY_INCREASE,
      createdAt: new Date(),
    });
    gameModel.gamePendingEffects = [...gameModel.gamePendingEffects, gamePendingEffect];
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
    const gamePendingEffect = new GamePendingEffectModel({
      gameId: gameModel.id,
      userId: movedCard.currentUserId,
      gameCardId: movedCard.id,
      effectType: EffectType.AIKAWARAZUYOKUWAKARANAIHANA_DAMAGE,
      createdAt: new Date(),
    });
    gameModel.gamePendingEffects = [...gameModel.gamePendingEffects, gamePendingEffect];
  }

  return gameModel;
}
