import { DeckModel } from 'src/models/deck.model';
import { DeckEntity } from '../entities/deck.entity';
import { DeckToModelMapper } from '../mappers/to-model/deck.to-model.mapper';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckRepository {
  constructor(private readonly dataSource: DataSource, private readonly deckToModelMapper: DeckToModelMapper) {}

  getEntityRepository(manager?: EntityManager) {
    const entityManager = manager ?? this.dataSource.manager;
    return entityManager.getRepository(DeckEntity);
  }

  async findById(id: number, manager?: EntityManager): Promise<DeckModel | null> {
    const entity = await this.getEntityRepository(manager).findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return this.deckToModelMapper.toModel(entity);
  }

  async findByUserId(userId: string, manager?: EntityManager): Promise<DeckModel[]> {
    const entities = await this.getEntityRepository(manager).find({ where: { userId } });
    return entities.map(entity => this.deckToModelMapper.toModel(entity));
  }

  async createDeck(userId: string, name: string, manager?: EntityManager): Promise<DeckModel> {
    const entityRepository = this.getEntityRepository(manager);

    const insertResult = await entityRepository.insert({ userId, name });

    const entity = await entityRepository.findOne({
      where: {
        id: insertResult.identifiers[0]?.id,
      },
    });

    if (!entity) {
      throw new Error('Deck not found after creation');
    }

    return this.deckToModelMapper.toModel(entity);
  }
}
