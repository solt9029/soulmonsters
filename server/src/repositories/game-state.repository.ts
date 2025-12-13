import { GameStateToModelMapper } from './../mappers/to-model/game-state.to-model.mapper';
import { GameStateModel } from 'src/models/game-state.model';
import { GameStateEntity } from '../entities/game-state.entity';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameStateRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly gameStateToModelMapper: GameStateToModelMapper,
  ) {}

  private getEntityRepository(manager?: EntityManager) {
    const entityManager = manager ?? this.dataSource.manager;
    return entityManager.getRepository(GameStateEntity);
  }

  async findAll(manager?: EntityManager): Promise<GameStateModel[]> {
    const entities = await this.getEntityRepository(manager).find();
    return entities.map(entity => this.gameStateToModelMapper.toModel(entity));
  }
}
