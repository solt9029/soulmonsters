import { GameEntity } from '../../../../entities/game.entity';
import { dealDamageToPlayer } from './dealDamageToPlayer';
import { drawCardFromDeck } from '../startDrawTime/drawCardFromDeck';

export const directAttack = (gameEntity: GameEntity, attackerCardId: number, opponentUserId: string): GameEntity => {
  const attackerCard = gameEntity.gameCards.find(card => card.id === attackerCardId);

  if (!attackerCard?.attack) {
    throw new Error();
  }

  dealDamageToPlayer(gameEntity, opponentUserId, attackerCard.attack);

  // カード固有の効果処理（カードID 11の冷徹な鳥の2枚ドロー）
  if (attackerCard.card.id === 11) {
    const attackerUserId = attackerCard.currentUserId;
    drawCardFromDeck(gameEntity, attackerUserId);
    drawCardFromDeck(gameEntity, attackerUserId);
  }

  return gameEntity;
};
