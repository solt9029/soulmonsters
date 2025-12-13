import { Injectable } from '@nestjs/common';
import { DeckEntity } from '../../entities/deck.entity';
import { DeckModel } from '../../models/deck.model';

@Injectable()
export class DeckToEntityMapper {
  toEntity(model: DeckModel): DeckEntity {
    return new DeckEntity({
      id: model.id,
      userId: model.userId,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
