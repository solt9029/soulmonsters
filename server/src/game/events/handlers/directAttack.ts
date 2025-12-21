import { DirectAttackEvent } from '..';
import { GameModel } from '../../../models/game.model';
import { dealDamageToPlayer } from '../../utils/dealDamageToPlayer';
import { drawCardFromDeck } from '../../actions/handlers/startDrawTime/drawCardFromDeck';
import { CARD_ID } from '../../../constants/card';

export function handleDirectAttack(event: DirectAttackEvent, gameModel: GameModel): GameModel {
  const attackerCard = gameModel.gameCards.find(gameCard => gameCard.id === event.attackerCardId);

  if (!attackerCard) {
    return gameModel;
  }

  if (attackerCard.card.id === CARD_ID.REITETSUNATOTI) {
    const attackerUserId = attackerCard.currentUserId;
    drawCardFromDeck(gameModel, attackerUserId);
    drawCardFromDeck(gameModel, attackerUserId);
  }

  if (attackerCard.card.id === CARD_ID.SAIFUKKATSUSHITATAKIBEE) {
    dealDamageToPlayer(gameModel, event.opponentUserId, 1000);
  }

  return gameModel;
}
