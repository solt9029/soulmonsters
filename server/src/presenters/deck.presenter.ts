import { Deck } from '../graphql';
import { DeckEntity } from '../entities/deck.entity';

export class DeckPresenter {
  static present(entity: DeckEntity): Deck {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
