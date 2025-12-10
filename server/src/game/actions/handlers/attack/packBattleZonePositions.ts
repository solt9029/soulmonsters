import { EntityManager } from 'typeorm';
import { GameCardRepository } from '../../../../repositories/game-card.repository';

export const packBattleZonePositions = async (
  manager: EntityManager,
  gameId: number,
  userId: string,
  removedPosition: number,
): Promise<void> => {
  const gameCardRepository = manager.withRepository(GameCardRepository);

  await gameCardRepository.query(
    `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameId} AND zone = "BATTLE" AND currentUserId = "${userId}" AND position > ${removedPosition} ORDER BY position`,
  );
};
