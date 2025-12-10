import { DeckModel } from 'src/models/deck.model';
import { AppDataSource } from '../dataSource';
import { DeckEntity } from '../entities/deck.entity';

export const DeckRepository = AppDataSource.getRepository(DeckEntity).extend({
  async findById(id: number): Promise<DeckModel | null> {
    const entity = await this.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return new DeckModel({
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  },

  async findByUserId(userId: string): Promise<DeckModel[]> {
    const entities = await this.find({ where: { userId } });

    return entities.map(entity => {
      return new DeckModel({
        id: entity.id,
        userId: entity.userId,
        name: entity.name,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      });
    });
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

    return new DeckModel({
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  },
});
