import { GameEntity } from '../entities/game.entity';
import { GameModel } from '../models/game.model';
import { GameToModelMapper } from '../mappers/to-model/game.to-model.mapper';
import { DataSource, EntityManager, InsertResult, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameRepository {
  constructor(private readonly dataSource: DataSource, private readonly gameToModelMapper: GameToModelMapper) {}

  private getEntityRepository(manager?: EntityManager) {
    const entityManager = manager ?? this.dataSource.manager;
    return entityManager.getRepository(GameEntity);
  }

  async findActiveGameByUserId(userId: string, manager?: EntityManager): Promise<GameModel | null> {
    const entity = await this.getEntityRepository(manager)
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getOne();

    return entity ? this.gameToModelMapper.toModel(entity) : null;
  }

  async findByIdWithRelations(id: number, manager?: EntityManager): Promise<GameModel | null> {
    const entity = await this.getEntityRepository(manager).findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck', 'gameCards', 'gameCards.card', 'gameStates', 'gameStates.gameCard'],
    });

    return entity ? this.gameToModelMapper.toModel(entity) : null;
  }

  async findByIdWithRelationsAndLock(id: number, manager?: EntityManager): Promise<GameModel | null> {
    const entity = await this.getEntityRepository(manager)
      .createQueryBuilder('games')
      .setLock('pessimistic_read')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .leftJoinAndSelect('games.gameCards', 'gameCards')
      .leftJoinAndSelect('gameCards.card', 'card')
      .leftJoinAndSelect('games.gameStates', 'gameStates')
      .leftJoinAndSelect('gameStates.gameCard', 'gameCard')
      .where('games.id = :id', { id })
      .getOne();

    return entity ? this.gameToModelMapper.toModel(entity) : null;
  }

  async findByIdWithGameUsersAndDeck(id: number, manager?: EntityManager): Promise<GameModel | null> {
    const entity = await this.getEntityRepository(manager).findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck'],
    });

    return entity ? this.gameToModelMapper.toModel(entity) : null;
  }

  // TODO: インターフェースをModelベースに変更する（EntityをRepositoryの外部に露出させない）
  async insert(data: Partial<GameEntity>, manager?: EntityManager): Promise<InsertResult> {
    return await this.getEntityRepository(manager).insert(data);
  }

  // TODO: インターフェースをModelベースに変更する（EntityをRepositoryの外部に露出させない）
  async update(
    criteria: FindOptionsWhere<GameEntity>,
    data: Partial<GameEntity>,
    manager?: EntityManager,
  ): Promise<void> {
    await this.getEntityRepository(manager).update(criteria, data);
  }
}
