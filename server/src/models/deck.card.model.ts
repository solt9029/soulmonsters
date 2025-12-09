import { CardModel } from './card.model';
import { DeckModel } from './deck.model';

export class DeckCardModel {
  constructor(partial?: Partial<DeckCardModel>) {
    Object.assign(this, partial);
  }

  id: number;
  count: number;
  createdAt: Date;
  updatedAt: Date;
  card: CardModel;
  deck: DeckModel;
}
