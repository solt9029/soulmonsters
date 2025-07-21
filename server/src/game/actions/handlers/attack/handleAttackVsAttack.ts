import { GameEntity } from '../../../../entities/game.entity';
import { destroyMonster } from './destroyMonster';
import { increaseEnergyToPlayer } from './increaseEnergyToPlayer';
import { dealDamageToPlayer } from './dealDamageToPlayer';
import { GameCardEntity } from 'src/entities/game.card.entity';

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
  gameEntity: GameEntity,
  attackerCardId: number,
  defenderCardId: number,
): GameEntity => {
  const attackerCard = gameEntity.gameCards.find(card => card.id === attackerCardId);
  const defenderCard = gameEntity.gameCards.find(card => card.id === defenderCardId);

  if (!attackerCard) {
    throw new Error('Attacker card not found');
  }

  if (!defenderCard) {
    throw new Error('Defender card not found');
  }

  const battleResult = determineBattleOutcome(attackerCard, defenderCard);

  let updatedGameEntity = gameEntity;

  if (battleResult.attackerDestroyed) {
    updatedGameEntity = destroyMonster(updatedGameEntity, attackerCardId);
    updatedGameEntity = increaseEnergyToPlayer(updatedGameEntity, attackerCard.currentUserId);
  }

  if (battleResult.defenderDestroyed) {
    updatedGameEntity = destroyMonster(updatedGameEntity, defenderCardId);
    updatedGameEntity = increaseEnergyToPlayer(updatedGameEntity, defenderCard.currentUserId);
  }

  if (battleResult.damageToAttacker > 0) {
    updatedGameEntity = dealDamageToPlayer(
      updatedGameEntity,
      attackerCard.currentUserId,
      battleResult.damageToAttacker,
    );
  }

  if (battleResult.damageToDefender > 0) {
    updatedGameEntity = dealDamageToPlayer(
      updatedGameEntity,
      defenderCard.currentUserId,
      battleResult.damageToDefender,
    );
  }

  return updatedGameEntity;
};
