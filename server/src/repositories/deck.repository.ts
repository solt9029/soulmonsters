import { DeckModel } from 'src/models/deck.model';
import { DeckEntity } from '../entities/deck.entity';
import { DeckToModelMapper } from '../mappers/to-model/deck.to-model.mapper';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckRepository {
  constructor(private readonly dataSource: DataSource, private readonly deckToModelMapper: DeckToModelMapper) {}

  async findById(id: number, manager?: EntityManager): Promise<DeckModel | null> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(DeckEntity);

    const entity = await entityRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return this.deckToModelMapper.toModel(entity);
  }

  async findByUserId(userId: string, manager?: EntityManager): Promise<DeckModel[]> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(DeckEntity);

    const entities = await entityRepository.find({ where: { userId } });

    return entities.map(entity => this.deckToModelMapper.toModel(entity));
  }

  async createDeck(userId: string, name: string, manager?: EntityManager): Promise<DeckModel> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(DeckEntity);

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
