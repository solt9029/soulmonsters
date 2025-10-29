import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { directAttack } from './attack/directAttack';
import { monsterBattle } from './attack/monsterBattle';
import { incrementAttackCount } from './attack/incrementAttackCount';
import { packBattleZonePositions } from './attack/packBattleZonePositions';
import { AttackValidationResult } from '../validators/attack';

// New validation result version
export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  validationResult: AttackValidationResult,
  gameEntity: GameEntity,
): Promise<void>;

// Legacy data version for backward compatibility
export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
): Promise<void>;

// Implementation
export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  dataOrValidationResult: GameActionDispatchInput | AttackValidationResult,
  gameEntity: GameEntity,
) {
  // Check if it's validation result or legacy data
  if ('attackTarget' in dataOrValidationResult) {
    // New validation result approach
    const validationResult = dataOrValidationResult as AttackValidationResult;
    const { gameCard, gameCardId, opponentGameUser, attackTarget } = validationResult;

    if (attackTarget.type === 'direct') {
      directAttack(gameEntity, gameCardId, attackTarget.targetUserId);
      incrementAttackCount(gameEntity, gameCardId);
      await manager.save(GameEntity, gameEntity);
      return;
    }

    // Monster battle case
    const { targetGameCard, targetGameCardId } = attackTarget;
    const originalGameCardPosition = gameCard.position;
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
  } else {
    // Legacy data approach
    const data = dataOrValidationResult as GameActionDispatchInput;
    const opponentGameUser = gameEntity.gameUsers.find(value => value.userId !== userId)!;

    if (data.payload.gameCardId == null) {
      throw new Error('Game card ID is null');
    }

    if (data.payload.targetGameUserIds?.length === 1) {
      directAttack(gameEntity, data.payload.gameCardId, opponentGameUser.userId);
      incrementAttackCount(gameEntity, data.payload.gameCardId);
      await manager.save(GameEntity, gameEntity);
      return;
    }

    const targetGameCardId = data.payload.targetGameCardIds?.[0];

    if (targetGameCardId == undefined) {
      throw new Error('Target game card IDs not provided');
    }

    const originalGameCardPosition = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId)?.position;
    const originalTargetGameCardPosition = gameEntity.gameCards.find(card => card.id === targetGameCardId)?.position;

    monsterBattle(gameEntity, data.payload.gameCardId, targetGameCardId);
    incrementAttackCount(gameEntity, data.payload.gameCardId);
    await manager.save(GameEntity, gameEntity);

    const updatedGameCardZone = gameEntity.gameCards.find(card => card.id === data.payload.gameCardId)?.zone;
    const updatedTargetGameCardZone = gameEntity.gameCards.find(card => card.id === targetGameCardId)?.zone;

    if (updatedGameCardZone !== 'BATTLE' && originalGameCardPosition) {
      await packBattleZonePositions(manager, gameEntity.id, userId, originalGameCardPosition);
    }

    if (updatedTargetGameCardZone !== 'BATTLE' && originalTargetGameCardPosition) {
      await packBattleZonePositions(manager, gameEntity.id, opponentGameUser.userId, originalTargetGameCardPosition);
    }
  }
}
