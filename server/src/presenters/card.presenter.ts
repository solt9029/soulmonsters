import { Card } from '../graphql';
import { CardModel } from '../models/card.model';

export class CardPresenter {
  static present(entity: CardModel): Card {
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
