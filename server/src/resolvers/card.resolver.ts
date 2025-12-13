import { Resolver, Query } from '@nestjs/graphql';
import { CardPresenter } from 'src/presenters/card.presenter';
import { CardRepository } from 'src/repositories/card.repository';

@Resolver()
export class CardResolver {
  constructor(private readonly cardRepository: CardRepository, private readonly cardPresenter: CardPresenter) {}

  @Query()
  async cards() {
    const cardModels = await this.cardRepository.findAll();
    return cardModels.map(cardModel => this.cardPresenter.present(cardModel));
  }
}
