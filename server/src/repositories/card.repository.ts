import { CardToModelMapper } from './../mappers/to-model/card.to-model.mapper';
import { CardModel } from 'src/models/card.model';
import { CardEntity } from '../entities/card.entity';
import { DataSource, EntityManager, In } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CardRepository {
  constructor(private readonly dataSource: DataSource, private readonly cardToModelMapper: CardToModelMapper) {}

  async findAll(manager?: EntityManager): Promise<CardModel[]> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = await entityManager.getRepository(CardEntity);

    const entities = await entityRepository.find();
    return entities.map(entity => this.cardToModelMapper.toModel(entity));
  }
}
