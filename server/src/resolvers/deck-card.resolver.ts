import { DeckCardUpdateInput } from 'src/graphql/index';
import { AuthGuard } from 'src/guards/auth.guard';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards, HttpStatus, HttpException, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';
import { DeckCardPresenter } from 'src/presenters/deck-card.presenter';
import { DeckCardRepository } from 'src/repositories/deck-card.repository';
import { DeckRepository } from 'src/repositories/deck.repository';

@Resolver()
@UseGuards(AuthGuard)
export class DeckCardResolver {
  private static get MAX_COUNT() {
    return 3;
  }
  private static get MIN_COUNT() {
    return 1;
  }

  constructor(
    @Inject('DeckCardRepository')
    private readonly deckCardRepository: typeof DeckCardRepository,
    private readonly deckRepository: DeckRepository,
    private readonly deckCardPresenter: DeckCardPresenter,
  ) {}

  @Query()
  async deckCards(@User() user: auth.DecodedIdToken, @Args('deckId') deckId: number) {
    const deckCardEntities = await this.deckCardRepository.findByDeckId(deckId);

    if (deckCardEntities.length > 0 && deckCardEntities[0]?.deck.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return deckCardEntities.map(deckCardEntity => this.deckCardPresenter.present(deckCardEntity));
  }

  @Mutation()
  async plusDeckCard(@Args('data') data: DeckCardUpdateInput, @User() user: auth.DecodedIdToken) {
    const { deckId, cardId } = data;

    const deckCardEntity = await this.deckCardRepository.findByDeckIdAndCardId(deckId, cardId);

    if (deckCardEntity !== null) {
      if (deckCardEntity.deck.userId !== user.uid) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      if (deckCardEntity.count >= DeckCardResolver.MAX_COUNT) {
        throw new BadRequestException('Max Count');
      }
      const updatedEntity = await this.deckCardRepository.updateCountById(deckCardEntity.id, deckCardEntity.count + 1);
      return this.deckCardPresenter.present(updatedEntity);
    }

    const deckEntity = await this.deckRepository.findById(deckId);
    if (deckEntity === null) {
      throw new NotFoundException();
    }
    if (deckEntity.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const createdEntity = await this.deckCardRepository.createDeckCard(deckId, cardId);
    return this.deckCardPresenter.present(createdEntity);
  }

  @Mutation()
  async minusDeckCard(@Args('data') data: DeckCardUpdateInput, @User() user: auth.DecodedIdToken) {
    const { deckId, cardId } = data;

    const deckCardEntity = await this.deckCardRepository.findByDeckIdAndCardId(deckId, cardId);

    if (deckCardEntity === null) {
      throw new NotFoundException();
    }

    if (deckCardEntity.deck.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (deckCardEntity.count > DeckCardResolver.MIN_COUNT) {
      const updatedEntity = await this.deckCardRepository.updateCountById(deckCardEntity.id, deckCardEntity.count - 1);
      return this.deckCardPresenter.present(updatedEntity);
    }

    const deletedEntity = await this.deckCardRepository.deleteDeckCard(deckCardEntity.id);
    return this.deckCardPresenter.present(deletedEntity);
  }
}
