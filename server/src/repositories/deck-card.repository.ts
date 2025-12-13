import { AppDataSource } from '../dataSource';
import { DeckCardEntity } from '../entities/deck-card.entity';
import { DeckCardModel } from '../models/deck-card.model';
import { DeckCardToModelMapper } from '../mappers/to-model/deck-card.to-model.mapper';
import { CardToModelMapper } from '../mappers/to-model/card.to-model.mapper';
import { DeckToModelMapper } from '../mappers/to-model/deck.to-model.mapper';

const cardToModelMapper = new CardToModelMapper();
const deckToModelMapper = new DeckToModelMapper();
const deckCardToModelMapper = new DeckCardToModelMapper(cardToModelMapper, deckToModelMapper);

// TODO: CardRepositoryやDeckRepositoryと同様に@Injectable()化する
// TODO: 各メソッドで同様にEntityManagerを受け取れるようにする
export const DeckCardRepository = AppDataSource.getRepository(DeckCardEntity).extend({
  async findByDeckId(deckId: number): Promise<DeckCardModel[]> {
    const entities = await this.find({
      where: { deck: { id: deckId } },
      relations: ['card', 'deck'],
    });

    return entities.map(entity => deckCardToModelMapper.toModel(entity));
  },

  async findByDeckIdAndCardId(deckId: number, cardId: number): Promise<DeckCardModel | null> {
    const entity = await this.findOne({
      where: { deck: { id: deckId }, card: { id: cardId } },
      relations: ['card', 'deck'],
    });

    if (!entity) {
      return null;
    }

    return deckCardToModelMapper.toModel(entity);
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

    return deckCardToModelMapper.toModel(entity);
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

    return deckCardToModelMapper.toModel(entity);
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

    return deckCardToModelMapper.toModel(entity);
  },
});
