import { CardService } from './../services/card.service';
import { Resolver, Query } from '@nestjs/graphql';
import { CardPresenter } from '../presenters/card.presenter';

@Resolver()
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query()
  async cards() {
    const cardModels = await this.cardService.findAll();
    return cardModels.map(CardPresenter.present);
  }
}
