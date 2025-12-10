import { Resolver, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CardPresenter } from 'src/presenters/card.presenter';
import { CardRepository } from 'src/repositories/card.repository';

@Resolver()
export class CardResolver {
  constructor(
    @Inject('CardRepository')
    private readonly cardRepository: typeof CardRepository,
    private readonly cardPresenter: CardPresenter,
  ) {}

  @Query()
  async cards() {
    const cardModels = await this.cardRepository.findAll();
    return cardModels.map(cardModel => this.cardPresenter.present(cardModel));
  }
}
