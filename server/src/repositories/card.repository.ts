import { CardModel } from 'src/models/card.model';
import { AppDataSource } from '../dataSource';
import { CardEntity } from '../entities/card.entity';

export const CardRepository = AppDataSource.getRepository(CardEntity).extend({
  async findAll(): Promise<CardModel[]> {
    const cardEntities = await this.find();

    return cardEntities.map(entity => {
      const model = new CardModel();
      model.id = entity.id;
      model.name = entity.name;
      model.kind = entity.kind;
      model.type = entity.type;
      model.attribute = entity.attribute;
      model.attack = entity.attack;
      model.defence = entity.defence;
      model.cost = entity.cost;
      model.detail = entity.detail;
      model.picture = entity.picture;
      return model;
    });
  },
});
