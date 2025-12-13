import { Injectable } from '@nestjs/common';
import { CardEntity } from '../../entities/card.entity';
import { CardModel } from '../../models/card.model';

@Injectable()
export class CardToEntityMapper {
  toEntity(model: CardModel): CardEntity {
    return new CardEntity({
      id: model.id,
      name: model.name,
      kind: model.kind,
      type: model.type,
      attribute: model.attribute,
      attack: model.attack,
      defence: model.defence,
      cost: model.cost,
      detail: model.detail,
      picture: model.picture,
    });
  }
}
