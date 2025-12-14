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

  // TODO: インターフェースをModelベースに変更する（EntityをRepositoryの外部に露出させない）
  async insert(entities: Partial<GameCardEntity>[], manager?: EntityManager): Promise<InsertResult> {
    return await this.getEntityRepository(manager).insert(entities);
  }
}
