import { GameModel } from '../../../../models/game.model';
import { destroyMonster } from './destroyMonster';
import { dealDamageToPlayer } from './dealDamageToPlayer';

export const handleAttackVsDefense = (
  gameModel: GameModel,
  attackerCardId: number,
  defenderCardId: number,
): GameModel => {
  const attackerCard = gameModel.gameCards.find(card => card.id === attackerCardId);
  const defenderCard = gameModel.gameCards.find(card => card.id === defenderCardId);

  if (!attackerCard || !defenderCard) {
    throw new Error();
  }

  if (attackerCard.attack == null || defenderCard.defence == null) {
    throw new Error('Attack or defence values are null');
  }

  if (attackerCard.attack > defenderCard.defence) {
    destroyMonster(gameModel, defenderCardId);
  } else if (attackerCard.attack < defenderCard.defence) {
    const damagePoint = defenderCard.defence - attackerCard.attack;
    dealDamageToPlayer(gameModel, attackerCard.currentUserId, damagePoint);
  }

  return gameModel;
};
