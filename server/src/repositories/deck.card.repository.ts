import { AppDataSource } from '../dataSource';
import { DeckCardEntity } from '../entities/deck.card.entity';
import { DeckCardModel } from '../models/deck.card.model';
import { CardModel } from '../models/card.model';
import { DeckModel } from '../models/deck.model';

const entityToModel = (entity: DeckCardEntity): DeckCardModel => {
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
};

export const DeckCardRepository = AppDataSource.getRepository(DeckCardEntity).extend({
  async findByDeckId(deckId: number): Promise<DeckCardModel[]> {
    const entities = await this.find({
      where: { deck: { id: deckId } },
      relations: ['card', 'deck'],
    });

    return entities.map(entityToModel);
  },

  async findByDeckIdAndCardId(deckId: number, cardId: number): Promise<DeckCardModel | null> {
    const entity = await this.findOne({
      where: { deck: { id: deckId }, card: { id: cardId } },
      relations: ['card', 'deck'],
    });

    if (!entity) {
      return null;
    }

    return entityToModel(entity);
  },

  async updateCountById(id: number, count: number): Promise<DeckCardModel> {
    await this.update({ id }, { count });
    const entity = await this.findOne({
      where: { id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found after update');
    }

    return entityToModel(entity);
  },

  async createDeckCard(deckId: number, cardId: number): Promise<DeckCardModel> {
    const insertResult = await this.insert({
      deck: { id: deckId },
      card: { id: cardId },
      count: 1,
    });
    const entity = await this.findOne({
      where: { id: insertResult.identifiers[0]?.id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found after creation');
    }

    return entityToModel(entity);
  },

  async deleteDeckCard(id: number): Promise<DeckCardModel> {
    const entity = await this.findOne({
      where: { id },
      relations: ['card', 'deck'],
    });
    if (!entity) {
      throw new Error('Deck card not found');
    }
    await this.delete({ id });

    return entityToModel(entity);
  },
});
