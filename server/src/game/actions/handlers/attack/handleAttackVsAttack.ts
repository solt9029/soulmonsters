import { GameModel } from '../../../../models/game.model';
import { destroyMonster } from './destroyMonster';
import { increaseEnergyToPlayer } from './increaseEnergyToPlayer';
import { dealDamageToPlayer } from './dealDamageToPlayer';
import { GameCardEntity } from 'src/entities/game-card.entity';

interface BattleResult {
  winner: 'attacker' | 'defender' | 'draw';
  attackerDestroyed: boolean;
  defenderDestroyed: boolean;
  damageToAttacker: number;
  damageToDefender: number;
}

const determineBattleOutcome = (attackerCard: GameCardEntity, defenderCard: GameCardEntity): BattleResult => {
  if (attackerCard.attack == null || defenderCard.attack == null) {
    throw new Error('Attack values are null');
  }

  if (attackerCard.attack > defenderCard.attack) {
    return {
      winner: 'attacker',
      attackerDestroyed: false,
      defenderDestroyed: true,
      damageToAttacker: 0,
      damageToDefender: attackerCard.attack - defenderCard.attack,
    };
  } else if (attackerCard.attack < defenderCard.attack) {
    return {
      winner: 'defender',
      attackerDestroyed: true,
      defenderDestroyed: false,
      damageToAttacker: defenderCard.attack - attackerCard.attack,
      damageToDefender: 0,
    };
  } else {
    return {
      winner: 'draw',
      attackerDestroyed: true,
      defenderDestroyed: true,
      damageToAttacker: 0,
      damageToDefender: 0,
    };
  }
};

export const handleAttackVsAttack = (
  gameModel: GameModel,
  attackerCardId: number,
  defenderCardId: number,
): GameModel => {
  const attackerCard = gameModel.gameCards.find(card => card.id === attackerCardId);
  const defenderCard = gameModel.gameCards.find(card => card.id === defenderCardId);

  if (!attackerCard || !defenderCard) {
    throw new Error();
  }

  const battleResult = determineBattleOutcome(attackerCard, defenderCard);

  if (battleResult.attackerDestroyed) {
    destroyMonster(gameModel, attackerCardId);
    increaseEnergyToPlayer(gameModel, attackerCard.currentUserId);
  }

  if (battleResult.defenderDestroyed) {
    destroyMonster(gameModel, defenderCardId);
    increaseEnergyToPlayer(gameModel, defenderCard.currentUserId);
  }

  if (battleResult.damageToAttacker > 0) {
    dealDamageToPlayer(gameModel, attackerCard.currentUserId, battleResult.damageToAttacker);
  }

  if (battleResult.damageToDefender > 0) {
    dealDamageToPlayer(gameModel, defenderCard.currentUserId, battleResult.damageToDefender);
  }

  return gameModel;
};
