import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { directAttack } from './attack/directAttack';
import { monsterBattle } from './attack/monsterBattle';
import { incrementAttackCount } from './attack/incrementAttackCount';
import { packBattleZonePositions } from './attack/packBattleZonePositions';
import { AttackValidationResult } from '../validators/attack';

// Function overload for backward compatibility
export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
): Promise<void>;
export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  validationResult: AttackValidationResult,
  gameEntity: GameEntity,
): Promise<void>;
export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  dataOrValidationResult: GameActionDispatchInput | AttackValidationResult,
  gameEntity: GameEntity,
) {
  let gameCard, gameCardId, opponentGameUser, attackTarget;

  if ('gameCard' in dataOrValidationResult) {
    // Using validation result
    ({ gameCard, gameCardId, opponentGameUser, attackTarget } = dataOrValidationResult);
  } else {
    // Backward compatibility - using data
    const data = dataOrValidationResult;
    opponentGameUser = gameEntity.gameUsers.find(value => value.userId !== userId)!;
    gameCardId = data.payload.gameCardId!;
    gameCard = gameEntity.gameCards.find(value => value.id === gameCardId);
    
    if (data.payload.targetGameUserIds?.length === 1) {
      attackTarget = { type: 'direct' as const, targetUserId: opponentGameUser.userId };
    } else {
      const targetGameCardId = data.payload.targetGameCardIds?.[0]!;
      const targetGameCard = gameEntity.gameCards.find(card => card.id === targetGameCardId)!;
      attackTarget = { 
        type: 'monster' as const, 
        targetGameCard, 
        targetGameCardId 
      };
    }
  }

  if (attackTarget.type === 'direct') {
    directAttack(gameEntity, gameCardId, attackTarget.targetUserId);
    incrementAttackCount(gameEntity, gameCardId);
    await manager.save(GameEntity, gameEntity);
    return;
  }

  // Monster battle case
  const { targetGameCard, targetGameCardId } = attackTarget;
  const originalGameCardPosition = gameCard?.position;
  const originalTargetGameCardPosition = targetGameCard.position;

  monsterBattle(gameEntity, gameCardId, targetGameCardId);
  incrementAttackCount(gameEntity, gameCardId);
  await manager.save(GameEntity, gameEntity);

  const updatedGameCardZone = gameEntity.gameCards.find(card => card.id === gameCardId)?.zone;
  const updatedTargetGameCardZone = gameEntity.gameCards.find(card => card.id === targetGameCardId)?.zone;

  if (updatedGameCardZone !== 'BATTLE' && originalGameCardPosition) {
    await packBattleZonePositions(manager, gameEntity.id, userId, originalGameCardPosition);
  }

  if (updatedTargetGameCardZone !== 'BATTLE' && originalTargetGameCardPosition) {
    await packBattleZonePositions(manager, gameEntity.id, opponentGameUser.userId, originalTargetGameCardPosition);
  }
}
