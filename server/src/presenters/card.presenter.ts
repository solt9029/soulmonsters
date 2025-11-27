import { Card } from '../graphql';
import { CardEntity } from '../entities/card.entity';

export class CardPresenter {
  static present(entity: CardEntity): Card {
    return {
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
    };
  }
}
