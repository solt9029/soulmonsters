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
  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId);
  const opponentGameUser = gameEntity.gameUsers.find(value => value.userId !== userId);

  if (!gameCard) {
    throw new Error('Game card not found');
  }

  if (!opponentGameUser) {
    throw new Error('Opponent game user not found');
  }

  if (data.payload.gameCardId == null) {
    throw new Error('Game card ID is null');
  }

  if (data.payload.targetGameUserIds?.length === 1) {
    directAttack(gameEntity, data.payload.gameCardId, opponentGameUser.userId);
    incrementAttackCount(gameEntity, data.payload.gameCardId);

    console.log(gameEntity.gameStates);

    await manager.save(GameEntity, gameEntity);
    return;
  }

  if (!data.payload.targetGameCardIds || data.payload.targetGameCardIds.length === 0) {
    throw new Error('Target game card IDs not provided');
  }

  const targetGameCardId = data.payload.targetGameCardIds[0];

  monsterBattle(gameEntity, data.payload.gameCardId, targetGameCardId);
  incrementAttackCount(gameEntity, data.payload.gameCardId);
  await manager.save(GameEntity, gameEntity);

  // TODO: packBattleZonePositionsの呼び出しをここに追加する
  // もともとのgameCardのpositionを最初に保持しておく
  // もともとのtargetGameCardのpositionを最初に保持しておく
  // もし、gameCardのzoneがBATTLEではなかったなら、packBattleZonePositionsを呼び出す
  // もし、targetGameCardのzoneがBATTLEではなかったなら、packBattleZonePositionsを呼び出す
}
