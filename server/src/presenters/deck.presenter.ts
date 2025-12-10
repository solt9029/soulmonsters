import { Injectable } from '@nestjs/common';
import { Deck } from '../graphql';
import { DeckModel } from '../models/deck.model';

@Injectable()
export class DeckPresenter {
  static present(model: DeckModel): Deck {
    return {
      id: model.id,
      userId: model.userId,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
