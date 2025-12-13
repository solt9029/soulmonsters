import { DeckCardModel } from '../models/deck-card.model';
import { DeckCardEntity } from '../entities/deck-card.entity';
import { DeckCardToModelMapper } from '../mappers/to-model/deck-card.to-model.mapper';
import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckCardRepository {
  constructor(private readonly dataSource: DataSource, private readonly deckCardToModelMapper: DeckCardToModelMapper) {}

  async findByDeckId(deckId: number, manager?: EntityManager): Promise<DeckCardModel[]> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(DeckCardEntity);

    const entities = await entityRepository.find({
      where: { deck: { id: deckId } },
      relations: ['card', 'deck'],
    });

    return entities.map(entity => this.deckCardToModelMapper.toModel(entity));
  }

  async findByDeckIdAndCardId(deckId: number, cardId: number, manager?: EntityManager): Promise<DeckCardModel | null> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(DeckCardEntity);

    const entity = await entityRepository.findOne({
      where: { deck: { id: deckId }, card: { id: cardId } },
      relations: ['card', 'deck'],
    });

    if (!entity) {
      return null;
    }

    return this.deckCardToModelMapper.toModel(entity);
  }

  async updateCountById(id: number, count: number, manager?: EntityManager): Promise<DeckCardModel> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(DeckCardEntity);

    await entityRepository.update({ id }, { count });
    const entity = await entityRepository.findOne({
      where: { id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found after update');
    }

    return this.deckCardToModelMapper.toModel(entity);
  }

  async createDeckCard(deckId: number, cardId: number, manager?: EntityManager): Promise<DeckCardModel> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(DeckCardEntity);

    const insertResult = await entityRepository.insert({
      deck: { id: deckId },
      card: { id: cardId },
      count: 1,
    });
    const entity = await entityRepository.findOne({
      where: { id: insertResult.identifiers[0]?.id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found after creation');
    }

    return this.deckCardToModelMapper.toModel(entity);
  }

  async deleteDeckCard(id: number, manager?: EntityManager): Promise<DeckCardModel> {
    const entityManager = manager ?? this.dataSource.manager;
    const entityRepository = entityManager.getRepository(DeckCardEntity);

    const entity = await entityRepository.findOne({
      where: { id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found');
    }
    await entityRepository.delete({ id });

    return this.deckCardToModelMapper.toModel(entity);
  }
}
