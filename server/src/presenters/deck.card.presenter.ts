import { DeckCard } from '../graphql';
import { DeckCardModel } from '../models/deck.card.model';
import { DeckPresenter } from './deck.presenter';
import { CardPresenter } from './card.presenter';

export class DeckCardPresenter {
  static present(model: DeckCardModel): DeckCard {
    return {
      id: model.id,
      count: model.count,
      deck: DeckPresenter.present(model.deck),
      card: CardPresenter.present(model.card),
    };
  }
}
