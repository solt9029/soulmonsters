import { DeckCardModel } from 'src/models/deck.card.model';
import { DeckCardEntity } from '../entities/deck.card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CardModel } from '../models/card.model';
import { DeckModel } from '../models/deck.model';

@Injectable()
export class DeckCardRepository {
  constructor(
    @InjectRepository(DeckCardEntity)
    private readonly repository: Repository<DeckCardEntity>,
  ) {}

  private entityToModel(entity: DeckCardEntity): DeckCardModel {
    return new DeckCardModel({
      id: entity.id,
      count: entity.count,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      card: new CardModel({
        id: entity.card.id,
        name: entity.card.name,
        kind: entity.card.kind,
        type: entity.card.type,
        attribute: entity.card.attribute,
        attack: entity.card.attack,
        defence: entity.card.defence,
        cost: entity.card.cost,
        detail: entity.card.detail,
        picture: entity.card.picture,
      }),
      deck: new DeckModel({
        id: entity.deck.id,
        userId: entity.deck.userId,
        name: entity.deck.name,
        createdAt: entity.deck.createdAt,
        updatedAt: entity.deck.updatedAt,
      }),
    });
  }

  async findByDeckId(deckId: number): Promise<DeckCardModel[]> {
    const entities = await this.repository.find({
      where: { deck: { id: deckId } },
      relations: ['card', 'deck'],
    });

    return entities.map(entity => this.entityToModel(entity));
  }

  async findByDeckIdAndCardId(deckId: number, cardId: number): Promise<DeckCardModel | null> {
    const entity = await this.repository.findOne({
      where: { deck: { id: deckId }, card: { id: cardId } },
      relations: ['card', 'deck'],
    });

    if (!entity) {
      return null;
    }

    return this.entityToModel(entity);
  }

  async updateCountById(id: number, count: number): Promise<DeckCardModel> {
    await this.repository.update({ id }, { count });
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found after update');
    }

    return this.entityToModel(entity);
  }

  async createDeckCard(deckId: number, cardId: number): Promise<DeckCardModel> {
    const insertResult = await this.repository.insert({
      deck: { id: deckId },
      card: { id: cardId },
      count: 1,
    });
    const entity = await this.repository.findOne({
      where: { id: insertResult.identifiers[0]?.id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found after creation');
    }

    return this.entityToModel(entity);
  }

  async deleteDeckCard(id: number): Promise<DeckCardModel> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found');
    }
    await this.repository.delete({ id });

    return this.entityToModel(entity);
  }
}
