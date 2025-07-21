import { GameEntity } from '../../../../entities/game.entity';
import { dealDamageToPlayer } from './dealDamageToPlayer';

export const directAttack = (gameEntity: GameEntity, attackerCardId: number, opponentUserId: string): GameEntity => {
  const attackerCard = gameEntity.gameCards.find(card => card.id === attackerCardId);

  if (!attackerCard) {
    throw new Error('Attacker card not found');
  }

  if (attackerCard.attack == null) {
    throw new Error('Game card attack is null');
  }

  let updatedGameEntity = dealDamageToPlayer(gameEntity, opponentUserId, attackerCard.attack);

  // カード固有の効果処理（例: カードID 11の冷徹な鳥の2枚ドロー）
  if (attackerCard.card.id === 11) {
    // TODO: 冷徹な鳥（11）が直接攻撃をしたら2枚ドローできる
  }

  return updatedGameEntity;
};
