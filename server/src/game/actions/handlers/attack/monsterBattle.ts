import { GameModel } from '../../../../models/game.model';
import { BattlePosition } from '../../../../graphql';
import { handleAttackVsAttack } from './handleAttackVsAttack';
import { handleAttackVsDefense } from './handleAttackVsDefense';

// ダメージ計算・ソウルゾーンへの移動・エナジー加算などの責務を持つ
export const monsterBattle = (gameModel: GameModel, attackerCardId: number, defenderCardId: number): GameModel => {
  const defenderCard = gameModel.gameCards.find(card => card.id === defenderCardId);

  if (!defenderCard) {
    throw new Error('Defender card not found');
  }

  if (defenderCard.battlePosition === BattlePosition.ATTACK) {
    return handleAttackVsAttack(gameModel, attackerCardId, defenderCardId);
  } else if (defenderCard.battlePosition === BattlePosition.DEFENCE) {
    return handleAttackVsDefense(gameModel, attackerCardId, defenderCardId);
  } else {
    throw new Error('Invalid battle position');
  }
};
