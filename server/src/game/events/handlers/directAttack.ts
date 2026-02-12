import { DirectAttackEvent } from '..';
import { GameModel } from '../../../models/game.model';
import { CARD_ID } from '../../../constants/card';
import { GamePendingEffectModel } from 'src/models/game-pending-effect.model';
import { EffectType } from 'src/graphql';

export function handleDirectAttack(event: DirectAttackEvent, gameModel: GameModel): GameModel {
  const attackerCard = gameModel.gameCards.find(gameCard => gameCard.id === event.attackerCardId);

  if (!attackerCard) {
    return gameModel;
  }

  if (attackerCard.card.id === CARD_ID.REITETSUNATOTI) {
    const gamePendingEffect = new GamePendingEffectModel({
      gameId: gameModel.id,
      userId: attackerCard.currentUserId,
      gameCardId: attackerCard.id,
      effectType: EffectType.REITETSUNATOTI_DRAW,
      createdAt: new Date(),
    });
    gameModel.gamePendingEffects = [...gameModel.gamePendingEffects, gamePendingEffect];
  }

  if (attackerCard.card.id === CARD_ID.SAIFUKKATSUSHITATAKIBEE) {
    const gamePendingEffect = new GamePendingEffectModel({
      gameId: gameModel.id,
      userId: attackerCard.currentUserId,
      gameCardId: attackerCard.id,
      effectType: EffectType.SAIFUKKATSUSHITATAKIBEE_DAMAGE,
      createdAt: new Date(),
    });
    gameModel.gamePendingEffects = [...gameModel.gamePendingEffects, gamePendingEffect];
  }

  return gameModel;
}
