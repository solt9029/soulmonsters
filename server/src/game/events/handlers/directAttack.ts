import { DirectAttackEvent } from '..';
import { GameModel } from '../../../models/game.model';
import { dealDamageToPlayer } from '../../actions/handlers/attack/dealDamageToPlayer';
import { drawCardFromDeck } from '../../actions/handlers/startDrawTime/drawCardFromDeck';

export function handleDirectAttack(event: DirectAttackEvent, gameModel: GameModel): GameModel {
  const attackerCard = gameModel.gameCards.find(card => card.id === event.attackerCardId);

  if (!attackerCard) {
    return gameModel;
  }

  // カード固有の効果処理（カードID 11の冷徹な鳥の2枚ドロー）
  if (attackerCard.card.id === 11) {
    const attackerUserId = attackerCard.currentUserId;
    drawCardFromDeck(gameModel, attackerUserId);
    drawCardFromDeck(gameModel, attackerUserId);
  }

  // 再復活したタキビー（カードID 2）の直接攻撃の場合、1000ポイントダメージを追加で与える
  if (attackerCard.card.id === 2) {
    dealDamageToPlayer(gameModel, event.opponentUserId, 1000);
  }

  return gameModel;
}