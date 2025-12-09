import { Inject, Injectable } from '@nestjs/common';
import { DeckCardRepository } from 'src/repositories/deck.card.repository';
import { DeckCardModel } from 'src/models/deck.card.model';

@Injectable()
export class DeckCardService {
  constructor(
    @Inject('DeckCardRepository')
    private readonly deckCardRepository: typeof DeckCardRepository,
  ) {}

  async findByDeckId(deckId: number): Promise<DeckCardModel[]> {
    return await this.deckCardRepository.findByDeckId(deckId);
  }

  async findByDeckIdAndCardId(deckId: number, cardId: number): Promise<DeckCardModel | null> {
    return await this.deckCardRepository.findByDeckIdAndCardId(deckId, cardId);
  }

  async updateCountById(id: number, count: number): Promise<DeckCardModel> {
    return await this.deckCardRepository.updateCountById(id, count);
  }

  async create(deckId: number, cardId: number): Promise<DeckCardModel> {
    return await this.deckCardRepository.createDeckCard(deckId, cardId);
  }

  async delete(id: number): Promise<DeckCardModel> {
    return await this.deckCardRepository.deleteDeckCard(id);
  }
}
