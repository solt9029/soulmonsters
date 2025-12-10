import { ValidatedDeckCreateInput } from './../inputs/validated.deck.create.input';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';
import { DeckPresenter } from '../presenters/deck.presenter';
import { DeckRepository } from '../repositories/deck.repository';

@Resolver()
@UseGuards(AuthGuard)
export class DeckResolver {
  constructor(private readonly deckRepository: DeckRepository) {}

  @Query()
  async decks(@User() user: auth.DecodedIdToken) {
    const deckModels = await this.deckRepository.findByUserId(user.uid);
    return deckModels.map(DeckPresenter.present);
  }

  @Mutation()
  async createDeck(@User() user: auth.DecodedIdToken, @Args('data') data: ValidatedDeckCreateInput) {
    const deckModel = await this.deckRepository.createDeck(user.uid, data.name);
    return DeckPresenter.present(deckModel);
  }
}
