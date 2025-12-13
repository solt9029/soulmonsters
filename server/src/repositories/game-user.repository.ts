import { DataSource, EntityManager, InsertResult, UpdateResult, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GameUserEntity } from '../entities/game-user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class GameUserRepository {
  constructor(private readonly dataSource: DataSource) {}

  private getEntityRepository(manager?: EntityManager) {
    const entityManager = manager ?? this.dataSource.manager;
    return entityManager.getRepository(GameUserEntity);
  }

  async findWaitingGameId(manager?: EntityManager): Promise<number | undefined> {
    const entityManager = manager ?? this.dataSource.manager;
    const result = await entityManager.query(
      'SELECT gameId AS id FROM gameUsers GROUP BY gameId HAVING COUNT(*) = 1 LIMIT 1 LOCK IN SHARE MODE',
    );

    return result.length > 0 ? result[0].id : undefined;
  }

  // TODO: インターフェースをModelベースに変更する（EntityをRepositoryの外部に露出させない）
  async insert(entity: QueryDeepPartialEntity<GameUserEntity>, manager?: EntityManager): Promise<InsertResult> {
    return await this.getEntityRepository(manager).insert(entity);
  }

  // TODO: インターフェースをModelベースに変更する（EntityをRepositoryの外部に露出させない）
  async update(
    criteria: FindOptionsWhere<GameUserEntity>,
    entity: Partial<GameUserEntity>,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    return await this.getEntityRepository(manager).update(criteria, entity);
  }

  async subtractEnergy(gameId: number, userId: string, amount: number, manager?: EntityManager): Promise<void> {
    const entityManager = manager ?? this.dataSource.manager;
    await entityManager.query(
      `UPDATE gameUsers SET energy = energy - ${amount} WHERE gameId = ${gameId} AND userId = '${userId}'`,
    );
  }
}
