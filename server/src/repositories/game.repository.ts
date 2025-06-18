import { EntityRepository, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';

@EntityRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {
  async findActiveGameByUserId(userId: string): Promise<GameEntity | undefined> {
    return await this.createQueryBuilder('games')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getOne();
  }

  async findByIdWithRelations(id: number): Promise<GameEntity | undefined> {
    return await this.findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck', 'gameCards', 'gameCards.card', 'gameStates', 'gameStates.gameCard'],
    });
  }

  async findByIdWithRelationsAndLock(id: number): Promise<GameEntity | undefined> {
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

  async findByIdWithGameUsersAndDeck(id: number): Promise<GameEntity | undefined> {
    return await this.findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck'],
    });
  }
}
