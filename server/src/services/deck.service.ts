import { DeckEntity } from './../entities/deck.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeckService {
  constructor(
    @InjectRepository(DeckEntity)
    private readonly deckRepository: Repository<DeckEntity>,
  ) {}

  async findById(id: number): Promise<DeckEntity | undefined> {
    return await this.deckRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<DeckEntity[]> {
    return await this.deckRepository.find({ where: { userId } });
  }

  async create(userId: string, name: string): Promise<DeckEntity> {
    const insertResult = await this.deckRepository.insert({ userId, name });
    return await this.deckRepository.findOne({
      where: { id: insertResult.identifiers[0].id },
    });
  }
}
