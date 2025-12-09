import { Inject, Injectable } from '@nestjs/common';
import { CardRepository } from 'src/repositories/card.repository';
import { CardModel } from 'src/models/card.model';

@Injectable()
export class CardService {
  constructor(
    @Inject('CardRepository')
    private readonly cardRepository: typeof CardRepository,
  ) {}

  async findAll(): Promise<CardModel[]> {
    return await this.cardRepository.findAll();
  }
}
