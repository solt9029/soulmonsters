import { Resolver, Query } from '@nestjs/graphql';
import { CardPresenter } from '../presenters/card.presenter';
import { CardRepository } from '../repositories/card.repository';

@Resolver()
export class CardResolver {
  constructor(private readonly cardRepository: CardRepository) {}

  @Query()
  async cards() {
    const cardModels = await this.cardRepository.findAll();
    return cardModels.map(CardPresenter.present);
  }
}
