import { GameLogEntity } from 'src/entities/game-log.entity';
import { GameLogModel } from 'src/models/game-log.model';
import { GameLogToModelMapper } from 'src/mappers/to-model/game-log.to-model.mapper';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameLogRepository {
  constructor(private readonly dataSource: DataSource, private readonly gameLogToModelMapper: GameLogToModelMapper) {}

  private getEntityRepository(manager?: EntityManager) {
    const entityManager = manager ?? this.dataSource.manager;
    return entityManager.getRepository(GameLogEntity);
  }

  async findByGameId(gameId: number): Promise<GameLogModel[]> {
    const entities = await this.getEntityRepository().find({
      where: { gameId },
      order: { createdAt: 'ASC' },
    });

    return entities.map(entity => this.gameLogToModelMapper.toModel(entity));
  }
}
