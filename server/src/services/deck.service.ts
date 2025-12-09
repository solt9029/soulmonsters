import { Inject, Injectable } from '@nestjs/common';
import { DeckRepository } from 'src/repositories/deck.repository';
import { DeckModel } from 'src/models/deck.model';

@Injectable()
export class DeckService {
  constructor(
    @Inject('DeckRepository')
    private readonly deckRepository: typeof DeckRepository,
  ) {}

  async findById(id: number): Promise<DeckModel | null> {
    return await this.deckRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<DeckModel[]> {
    return await this.deckRepository.findByUserId(userId);
  }

  async create(userId: string, name: string): Promise<DeckModel> {
    return await this.deckRepository.createDeck(userId, name);
  }
}
