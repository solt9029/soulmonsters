import { EntityRepository, Repository } from 'typeorm';
import { GameUserEntity } from '../entities/game.user.entity';

@EntityRepository(GameUserEntity)
export class GameUserRepository extends Repository<GameUserEntity> {
  /**
   * Find waiting games (games with only 1 player)
   * Returns array of game IDs that are waiting for players
   */
  async findWaitingGameIds(): Promise<{ id: number }[]> {
    return await this.query(
      'SELECT gameId AS id FROM gameUsers GROUP BY gameId HAVING COUNT(*) = 1 LIMIT 1 LOCK IN SHARE MODE',
    );
  }

  /**
   * Create game user entry
   */
  async createGameUser(data: {
    userId: string;
    deckId: number;
    gameId: number;
    energy?: number;
  }): Promise<void> {
    await this.insert({
      userId: data.userId,
      deck: { id: data.deckId },
      lastViewedAt: new Date(),
      game: { id: data.gameId },
      energy: data.energy || 0,
    });
  }

  /**
   * Update user energy
   */
  async updateUserEnergy(userId: string, energy: number): Promise<void> {
    await this.update({ userId }, { energy });
  }
}