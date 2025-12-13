import { ValidatedDeckCreateInput } from 'src/inputs/validated-deck-create.input';
import { AuthGuard } from 'src/guards/auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';
import { DeckPresenter } from 'src/presenters/deck.presenter';
import { DeckRepository } from 'src/repositories/deck.repository';

@Resolver()
@UseGuards(AuthGuard)
export class DeckResolver {
  constructor(
    private readonly deckRepository: DeckRepository,
    private readonly deckPresenter: DeckPresenter,
  ) {}

  @Query()
  async decks(@User() user: auth.DecodedIdToken) {
    const deckModels = await this.deckRepository.findByUserId(user.uid);
    return deckModels.map(deckModel => this.deckPresenter.present(deckModel));
  }

  @Mutation()
  async createDeck(@User() user: auth.DecodedIdToken, @Args('data') data: ValidatedDeckCreateInput) {
    const deckModel = await this.deckRepository.createDeck(user.uid, data.name);
    return this.deckPresenter.present(deckModel);
  }
}
