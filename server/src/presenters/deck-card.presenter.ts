import { DeckCard } from '../graphql';
import { DeckCardModel } from '../models/deck-card.model';
import { DeckPresenter } from './deck.presenter';
import { CardPresenter } from './card.presenter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeckCardPresenter {
  constructor(private readonly deckPresenter: DeckPresenter, private readonly cardPresenter: CardPresenter) {}

  present(model: DeckCardModel): DeckCard {
    return {
      id: model.id,
      count: model.count,
      deck: this.deckPresenter.present(model.deck),
      card: this.cardPresenter.present(model.card),
    };
  }
}
