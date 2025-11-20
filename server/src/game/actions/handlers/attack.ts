import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { directAttack } from './attack/directAttack';
import { monsterBattle } from './attack/monsterBattle';
import { incrementAttackCount } from './attack/incrementAttackCount';
import { packBattleZonePositions } from './attack/packBattleZonePositions';
import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameUserEntity } from 'src/entities/game.user.entity';

export type AttackActionPayload =
  | {
      type: 'DIRECT_ATTACK';
      attackerCard: GameCardEntity;
      opponentGameUser: GameUserEntity;
      attackerUserId: string;
    }
  | {
      type: 'MONSTER_BATTLE';
      attackerCard: GameCardEntity;
      targetCard: GameCardEntity;
      attackerUserId: string;
      opponentUserId: string;
    };

export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  payload: AttackActionPayload,
  gameEntity: GameEntity,
) {
  if (payload.type === 'DIRECT_ATTACK') {
    directAttack(gameEntity, payload.attackerCard.id, payload.opponentGameUser.userId);
    incrementAttackCount(gameEntity, payload.attackerCard.id);
    await manager.save(GameEntity, gameEntity);
    return;
  }

  const originalGameCardPosition = payload.attackerCard.position;
  const originalTargetGameCardPosition = payload.targetCard.position;

  monsterBattle(gameEntity, payload.attackerCard.id, payload.targetCard.id);
  incrementAttackCount(gameEntity, payload.attackerCard.id);
  await manager.save(GameEntity, gameEntity);

  const updatedGameCardZone = gameEntity.gameCards.find(card => card.id === payload.attackerCard.id)?.zone;
  const updatedTargetGameCardZone = gameEntity.gameCards.find(card => card.id === payload.targetCard.id)?.zone;

  if (updatedGameCardZone !== 'BATTLE' && originalGameCardPosition) {
    await packBattleZonePositions(manager, gameEntity.id, userId, originalGameCardPosition);
  }

  if (updatedTargetGameCardZone !== 'BATTLE' && originalTargetGameCardPosition) {
    await packBattleZonePositions(manager, gameEntity.id, payload.opponentUserId, originalTargetGameCardPosition);
  }
}
