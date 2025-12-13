import { EntityManager } from 'typeorm';
import { GameCardEntity } from 'src/entities/game-card.entity';

export const packBattleZonePositions = async (
  manager: EntityManager,
  gameId: number,
  userId: string,
  removedPosition: number,
): Promise<void> => {
  await manager
    .getRepository(GameCardEntity)
    .query(
      `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameId} AND zone = "BATTLE" AND currentUserId = "${userId}" AND position > ${removedPosition} ORDER BY position`,
    );
};
