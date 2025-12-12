import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { directAttack } from './attack/directAttack';
import { monsterBattle } from './attack/monsterBattle';
import { incrementAttackCount } from './attack/incrementAttackCount';
import { packBattleZonePositions } from './attack/packBattleZonePositions';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';

export type AttackActionPayload =
  | {
      type: 'DIRECT_ATTACK';
      attackerCard: GameCardModel;
      opponentGameUser: GameUserModel;
      attackerUserId: string;
    }
  | {
      type: 'MONSTER_BATTLE';
      attackerCard: GameCardModel;
      targetCard: GameCardModel;
      attackerUserId: string;
      opponentUserId: string;
    };

export async function handleAttackAction(
  manager: EntityManager,
  userId: string,
  payload: AttackActionPayload,
  gameModel: GameModel,
) {
  if (payload.type === 'DIRECT_ATTACK') {
    directAttack(gameModel, payload.attackerCard.id, payload.opponentGameUser.userId);
    incrementAttackCount(gameModel, payload.attackerCard.id);
    await manager.save(gameModel.toEntity());
    return;
  }

  const originalGameCardPosition = payload.attackerCard.position;
  const originalTargetGameCardPosition = payload.targetCard.position;

  monsterBattle(gameModel, payload.attackerCard.id, payload.targetCard.id);
  incrementAttackCount(gameModel, payload.attackerCard.id);
  await manager.save(gameModel.toEntity());

  const updatedGameCardZone = gameModel.gameCards.find(card => card.id === payload.attackerCard.id)?.zone;
  const updatedTargetGameCardZone = gameModel.gameCards.find(card => card.id === payload.targetCard.id)?.zone;

  if (updatedGameCardZone !== 'BATTLE' && originalGameCardPosition) {
    await packBattleZonePositions(manager, gameModel.id, userId, originalGameCardPosition);
  }

  if (updatedTargetGameCardZone !== 'BATTLE' && originalTargetGameCardPosition) {
    await packBattleZonePositions(manager, gameModel.id, payload.opponentUserId, originalTargetGameCardPosition);
  }
}
