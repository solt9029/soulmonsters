import { GameEntity } from '../../../../entities/game.entity';
import { destroyMonster } from './destroyMonster';
import { dealDamageToPlayer } from './dealDamageToPlayer';

export const handleAttackVsDefense = (
  gameEntity: GameEntity,
  attackerCardId: number,
  defenderCardId: number,
): GameEntity => {
  const attackerCard = gameEntity.gameCards.find(card => card.id === attackerCardId);
  const defenderCard = gameEntity.gameCards.find(card => card.id === defenderCardId);

  if (!attackerCard || !defenderCard) {
    throw new Error();
  }

  if (attackerCard.attack == null || defenderCard.defence == null) {
    throw new Error('Attack or defence values are null');
  }

  if (attackerCard.attack > defenderCard.defence) {
    destroyMonster(gameEntity, defenderCardId);
  } else if (attackerCard.attack < defenderCard.defence) {
    const damagePoint = defenderCard.defence - attackerCard.attack;
    dealDamageToPlayer(gameEntity, attackerCard.currentUserId, damagePoint);
  }

  return gameEntity;
};
