import { EntityRepository, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';

@EntityRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {
  /**
   * Find game by ID with optional relations
   */
  async findById(
    id: number,
    options?: {
      loadGameUsers?: boolean;
      loadGameCards?: boolean;
      loadGameStates?: boolean;
      loadCardDetails?: boolean;
      loadDeckDetails?: boolean;
    },
  ): Promise<GameEntity | undefined> {
    const relations = [];
    
    if (options?.loadGameUsers) {
      relations.push('gameUsers');
      if (options?.loadDeckDetails) {
        relations.push('gameUsers.deck');
      }
    }
    
    if (options?.loadGameCards) {
      relations.push('gameCards');
      if (options?.loadCardDetails) {
        relations.push('gameCards.card');
      }
    }
    
    if (options?.loadGameStates) {
      relations.push('gameStates');
      relations.push('gameStates.gameCard');
    }

    return await this.findOne({
      where: { id },
      relations,
    });
  }

  /**
   * Find active game by user ID
   */
  async findActiveGameByUserId(userId: string): Promise<GameEntity | undefined> {
    return await this.createQueryBuilder('games')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getOne();
  }

  /**
   * Find game by ID with pessimistic lock and all relations for game actions
   */
  async findByIdWithLockForAction(id: number): Promise<GameEntity> {
    return await this.createQueryBuilder('games')
      .setLock('pessimistic_read')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .leftJoinAndSelect('games.gameCards', 'gameCards')
      .leftJoinAndSelect('gameCards.card', 'card')
      .leftJoinAndSelect('games.gameStates', 'gameStates')
      .leftJoinAndSelect('gameStates.gameCard', 'gameCard')
      .where('games.id = :id', { id })
      .getOne();
  }

  /**
   * Find waiting game with pessimistic lock
   */
  async findWaitingGameWithLock(gameId: number): Promise<GameEntity> {
    return await this.createQueryBuilder('games')
      .setLock('pessimistic_read')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.id = :gameId', { gameId })
      .getOne();
  }

  /**
   * Check if user has an active game
   */
  async hasActiveGame(userId: string): Promise<boolean> {
    const count = await this.createQueryBuilder('games')
      .leftJoin('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getCount();
    
    return count > 0;
  }
}