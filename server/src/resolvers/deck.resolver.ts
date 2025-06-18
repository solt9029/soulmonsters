import { ValidatedDeckCreateInput } from './../inputs/validated.deck.create.input';
import { DeckService } from './../services/deck.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';

@Resolver()
@UseGuards(AuthGuard)
export class DeckResolver {
  constructor(private readonly deckService: DeckService) {}

  @Query()
  async decks(@User() user: auth.DecodedIdToken) {
    return await this.deckService.findByUserId(user.uid);
  }

  @Mutation()
  async createDeck(@User() user: auth.DecodedIdToken, @Args('data') data: ValidatedDeckCreateInput) {
    return await this.deckService.create(user.uid, data.name);
  }
}
