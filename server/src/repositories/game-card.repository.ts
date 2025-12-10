import { AppDataSource } from '../dataSource';
import { GameCardEntity } from '../entities/game-card.entity';

export const GameCardRepository = AppDataSource.getRepository(GameCardEntity).extend({
  // removedPosition以降を1つずつ詰める
  async packHandPositions(gameId: number, userId: string, removedPosition: number): Promise<void> {
    await this.query(
      `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameId} AND zone = "HAND" AND currentUserId = "${userId}" AND position > ${removedPosition} ORDER BY position`,
    );
  },
});
