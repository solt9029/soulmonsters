import { DeckModel } from 'src/models/deck.model';
import { AppDataSource } from '../dataSource';
import { DeckEntity } from '../entities/deck.entity';
import { DeckToModelMapper } from '../mappers/to-model/deck.to-model.mapper';

const deckToModelMapper = new DeckToModelMapper();

export const DeckRepository = AppDataSource.getRepository(DeckEntity).extend({
  async findById(id: number): Promise<DeckModel | null> {
    const entity = await this.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return deckToModelMapper.toModel(entity);
  },

  async findByUserId(userId: string): Promise<DeckModel[]> {
    const entities = await this.find({ where: { userId } });

    return entities.map(entity => deckToModelMapper.toModel(entity));
  },

  async createDeck(userId: string, name: string): Promise<DeckModel> {
    const insertResult = await this.insert({ userId, name });
    const entity = await this.findOne({
      where: {
        id: insertResult.identifiers[0]?.id,
      },
    });
    if (!entity) {
      throw new Error('Deck not found after creation');
    }

    return deckToModelMapper.toModel(entity);
  },
});
