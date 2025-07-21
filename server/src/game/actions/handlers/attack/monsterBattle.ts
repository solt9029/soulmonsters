import { GameEntity } from '../../../../entities/game.entity';
import { BattlePosition } from '../../../../graphql';
import { handleAttackVsAttack } from './handleAttackVsAttack';
import { handleAttackVsDefense } from './handleAttackVsDefense';

// ダメージ計算・ソウルゾーンへの移動・エナジー加算などの責務を持つ
export const monsterBattle = (gameEntity: GameEntity, attackerCardId: number, defenderCardId: number): GameEntity => {
  const defenderCard = gameEntity.gameCards.find(card => card.id === defenderCardId);

  if (!defenderCard) {
    throw new Error('Defender card not found');
  }

  if (defenderCard.battlePosition === BattlePosition.ATTACK) {
    return handleAttackVsAttack(gameEntity, attackerCardId, defenderCardId);
  } else if (defenderCard.battlePosition === BattlePosition.DEFENCE) {
    return handleAttackVsDefense(gameEntity, attackerCardId, defenderCardId);
  } else {
    throw new Error('Invalid battle position');
  }
};
