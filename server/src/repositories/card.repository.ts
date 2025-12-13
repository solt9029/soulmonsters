import { CardModel } from 'src/models/card.model';
import { AppDataSource } from '../dataSource';
import { CardEntity } from '../entities/card.entity';
import { CardToModelMapper } from '../mappers/to-model/card.to-model.mapper';

const cardToModelMapper = new CardToModelMapper();

export const CardRepository = AppDataSource.getRepository(CardEntity).extend({
  async findAll(): Promise<CardModel[]> {
    const cardEntities = await this.find();

    return cardEntities.map(entity => cardToModelMapper.toModel(entity));
  },
});
