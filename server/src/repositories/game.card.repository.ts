import { EntityRepository, Repository } from 'typeorm';
import { GameCardEntity } from '../entities/game.card.entity';

@EntityRepository(GameCardEntity)
export class GameCardRepository extends Repository<GameCardEntity> {
  // removedPosition以降を1つずつ詰める
  async packHandPositions(gameId: number, userId: string, removedPosition: number): Promise<void> {
    await this.query(
      `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameId} AND zone = "HAND" AND currentUserId = "${userId}" AND position > ${removedPosition} ORDER BY position`,
    );
  }
}
