import { Resolver, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CardPresenter } from '../presenters/card.presenter';
import { CardRepository } from '../repositories/card.repository';

@Resolver()
export class CardResolver {
  constructor(
    @Inject('CardRepository')
    private readonly cardRepository: typeof CardRepository,
  ) {}

  @Query()
  async cards() {
    const cardModels = await this.cardRepository.findAll();
    return cardModels.map(CardPresenter.present);
  }
}
