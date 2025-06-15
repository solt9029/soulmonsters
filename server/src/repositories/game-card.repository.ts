import { EntityRepository, Repository } from 'typeorm';
import { GameCardEntity } from '../entities/game.card.entity';

@EntityRepository(GameCardEntity)
export class GameCardRepository extends Repository<GameCardEntity> {
  /**
   * Bulk insert game cards
   */
  async insertGameCards(gameCards: GameCardEntity[]): Promise<void> {
    if (gameCards.length > 0) {
      await this.insert(gameCards);
    }
  }
}