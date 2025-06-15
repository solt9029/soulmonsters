import { CardService } from './../services/card.service';
import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Query()
  async cards() {
    return await this.cardService.findAll();
  }
}
