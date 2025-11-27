import { ValidatedDeckCreateInput } from './../inputs/validated.deck.create.input';
import { DeckService } from './../services/deck.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';
import { DeckPresenter } from '../presenters/deck.presenter';

@Resolver()
@UseGuards(AuthGuard)
export class DeckResolver {
  constructor(private readonly deckService: DeckService) {}

  @Query()
  async decks(@User() user: auth.DecodedIdToken) {
    const deckEntities = await this.deckService.findByUserId(user.uid);
    return deckEntities.map(DeckPresenter.present);
  }

  @Mutation()
  async createDeck(@User() user: auth.DecodedIdToken, @Args('data') data: ValidatedDeckCreateInput) {
    const deckEntity = await this.deckService.create(user.uid, data.name);
    return DeckPresenter.present(deckEntity);
  }
}
