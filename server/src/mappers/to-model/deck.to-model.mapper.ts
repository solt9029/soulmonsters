import { Injectable } from '@nestjs/common';
import { DeckEntity } from '../../entities/deck.entity';
import { DeckModel } from '../../models/deck.model';

@Injectable()
export class DeckToModelMapper {
  toModel(entity: DeckEntity): DeckModel {
    return new DeckModel({
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
