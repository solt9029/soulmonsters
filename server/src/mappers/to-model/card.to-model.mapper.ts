import { Injectable } from '@nestjs/common';
import { CardEntity } from '../../entities/card.entity';
import { CardModel } from '../../models/card.model';

@Injectable()
export class CardToModelMapper {
  toModel(entity: CardEntity): CardModel {
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
  }
}
