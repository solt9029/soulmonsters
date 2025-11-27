import { DeckCard } from '../graphql';
import { DeckCardEntity } from '../entities/deck.card.entity';
import { DeckPresenter } from './deck.presenter';
import { CardPresenter } from './card.presenter';

export class DeckCardPresenter {
  static present(entity: DeckCardEntity): DeckCard {
    return {
      id: entity.id,
      count: entity.count,
      deck: DeckPresenter.present(entity.deck),
      card: CardPresenter.present(entity.card),
    };
  }
}
