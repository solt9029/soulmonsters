import { CardToModelMapper } from './../mappers/to-model/card.to-model.mapper';
import { CardModel } from 'src/models/card.model';
import { CardEntity } from '../entities/card.entity';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CardRepository {
  constructor(private readonly dataSource: DataSource, private readonly cardToModelMapper: CardToModelMapper) {}

  getEntityRepository(manager?: EntityManager) {
    const entityManager = manager ?? this.dataSource.manager;
    return entityManager.getRepository(CardEntity);
  }

  async findAll(manager?: EntityManager): Promise<CardModel[]> {
    const entities = await this.getEntityRepository(manager).find();
    return entities.map(entity => this.cardToModelMapper.toModel(entity));
  }
}
