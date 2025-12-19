import { GameModel } from '../../../../models/game.model';
import { dealDamageToPlayer } from './dealDamageToPlayer';
import { drawCardFromDeck } from '../startDrawTime/drawCardFromDeck';

export const directAttack = (gameModel: GameModel, attackerCardId: number, opponentUserId: string): GameModel => {
  const attackerCard = gameModel.gameCards.find(card => card.id === attackerCardId);

  if (!attackerCard?.attack) {
    throw new Error();
  }

  dealDamageToPlayer(gameModel, opponentUserId, attackerCard.attack);

  // カード固有の効果処理（カードID 11の冷徹な鳥の2枚ドロー）
  if (attackerCard.card.id === 11) {
    const attackerUserId = attackerCard.currentUserId;
    drawCardFromDeck(gameModel, attackerUserId);
    drawCardFromDeck(gameModel, attackerUserId);
  }

  // 再復活したタキビー（カードID 2）の直接攻撃の場合、1000ポイントダメージを追加で与える
  if (attackerCard.card.id === 2) {
    dealDamageToPlayer(gameModel, opponentUserId, 1000);
  }

  return gameModel;
};
