import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';
import { directAttack } from './attack/directAttack';
import { monsterBattle } from './attack/monsterBattle';
import { incrementAttackCount } from './attack/incrementAttackCount';
import { packBattleZonePositions } from './attack/packBattleZonePositions';

export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
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
