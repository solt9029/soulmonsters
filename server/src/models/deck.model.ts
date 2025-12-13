import { DeckEntity } from 'src/entities/deck.entity';
import { DeckToEntityMapper } from '../mappers/to-entity/deck.to-entity.mapper';

export class DeckModel {
  constructor(partial?: Partial<DeckModel>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
