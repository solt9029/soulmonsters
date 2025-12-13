import { Injectable } from '@nestjs/common';
import { DeckCardEntity } from '../../entities/deck-card.entity';
import { DeckCardModel } from '../../models/deck-card.model';
import { CardToModelMapper } from './card.to-model.mapper';
import { DeckToModelMapper } from './deck.to-model.mapper';

@Injectable()
export class DeckCardToModelMapper {
  constructor(
    private readonly cardToModelMapper: CardToModelMapper,
    private readonly deckToModelMapper: DeckToModelMapper,
  ) {}

  toModel(entity: DeckCardEntity): DeckCardModel {
    return new DeckCardModel({
      id: entity.id,
      count: entity.count,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      card: this.cardToModelMapper.toModel(entity.card),
      deck: this.deckToModelMapper.toModel(entity.deck),
    });
  }
}
