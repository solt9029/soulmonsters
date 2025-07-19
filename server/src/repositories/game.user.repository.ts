import { EntityRepository, Repository } from 'typeorm';
import { GameUserEntity } from '../entities/game.user.entity';

@EntityRepository(GameUserEntity)
export class GameUserRepository extends Repository<GameUserEntity> {
  async findWaitingGameId(): Promise<number | undefined> {
    const result = await this.query(
      'SELECT gameId AS id FROM gameUsers GROUP BY gameId HAVING COUNT(*) = 1 LIMIT 1 LOCK IN SHARE MODE',
    );

    return result.length > 0 ? result[0].id : undefined;
  }

  async subtractEnergy(gameId: number, userId: string, amount: number): Promise<void> {
    await this.query(
      `UPDATE gameUsers SET energy = energy - ${amount} WHERE gameId = ${gameId} AND userId = '${userId}'`,
    );
  }
}
