import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, InsertResult } from 'typeorm';
import { GameCardEntity } from '../entities/game-card.entity';

@Injectable()
export class GameCardRepository {
  constructor(private readonly dataSource: DataSource) {}

  private getEntityRepository(manager?: EntityManager) {
    const entityManager = manager ?? this.dataSource.manager;
    return entityManager.getRepository(GameCardEntity);
  }

  async insert(entities: Partial<GameCardEntity>[], manager?: EntityManager): Promise<InsertResult> {
    return await this.getEntityRepository(manager).insert(entities);
  }

  async packHandPositions(
    gameId: number,
    userId: string,
    removedPosition: number,
    manager?: EntityManager,
  ): Promise<void> {
    const entityManager = manager ?? this.dataSource.manager;
    await entityManager.query(
      `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameId} AND zone = "HAND" AND currentUserId = "${userId}" AND position > ${removedPosition} ORDER BY position`,
    );
  }
}
