import { CardModel } from 'src/models/card.model';
import { AppDataSource } from '../dataSource';
import { CardEntity } from '../entities/card.entity';

export const CardRepository = AppDataSource.getRepository(CardEntity).extend({
  async findAll(): Promise<CardModel[]> {
    const cardEntities = await this.find();

    return cardEntities.map(entity => {
      return new CardModel({
        id: entity.id,
        name: entity.name,
        kind: entity.kind,
        type: entity.type,
        attribute: entity.attribute,
        attack: entity.attack,
        defence: entity.defence,
        cost: entity.cost,
        detail: entity.detail,
        picture: entity.picture,
      });
    });
  },
});
