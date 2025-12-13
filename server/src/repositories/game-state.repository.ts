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

  async findAll(manager?: EntityManager): Promise<GameStateModel[]> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(GameStateEntity);

    const entities = await entityRepository.find();
    return entities.map(entity => this.gameStateToModelMapper.toModel(entity));
  }
}
