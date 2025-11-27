import { DeckService } from './../services/deck.service';
import { DeckCardUpdateInput } from './../graphql/index';
import { DeckCardService } from './../services/deck.card.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards, HttpStatus, HttpException, BadRequestException, NotFoundException } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';
import { DeckCardPresenter } from '../presenters/deck.card.presenter';

@Resolver()
@UseGuards(AuthGuard)
export class DeckCardResolver {
  private static get MAX_COUNT() {
    return 3;
  }
  private static get MIN_COUNT() {
    return 1;
  }

  constructor(private readonly deckCardService: DeckCardService, private readonly deckService: DeckService) {}

  @Query()
  async deckCards(@User() user: auth.DecodedIdToken, @Args('deckId') deckId: number) {
    const deckCardEntities = await this.deckCardService.findByDeckId(deckId);

    if (deckCardEntities.length > 0 && deckCardEntities[0]?.deck.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return deckCardEntities.map(DeckCardPresenter.present);
  }

  @Mutation()
  async plusDeckCard(@Args('data') data: DeckCardUpdateInput, @User() user: auth.DecodedIdToken) {
    const { deckId, cardId } = data;

    const deckCardEntity = await this.deckCardService.findByDeckIdAndCardId(deckId, cardId);

    if (deckCardEntity !== null) {
      if (deckCardEntity.deck.userId !== user.uid) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      if (deckCardEntity.count >= DeckCardResolver.MAX_COUNT) {
        throw new BadRequestException('Max Count');
      }
      const updatedEntity = await this.deckCardService.updateCountById(deckCardEntity.id, deckCardEntity.count + 1);
      return DeckCardPresenter.present(updatedEntity);
    }

    const deckEntity = await this.deckService.findById(deckId);
    if (deckEntity === null) {
      throw new NotFoundException();
    }
    if (deckEntity.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const createdEntity = await this.deckCardService.create(deckId, cardId);
    return DeckCardPresenter.present(createdEntity);
  }

  @Mutation()
  async minusDeckCard(@Args('data') data: DeckCardUpdateInput, @User() user: auth.DecodedIdToken) {
    const { deckId, cardId } = data;

    const deckCardEntity = await this.deckCardService.findByDeckIdAndCardId(deckId, cardId);

    if (deckCardEntity === null) {
      throw new NotFoundException();
    }

    if (deckCardEntity.deck.userId !== user.uid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    if (deckCardEntity.count > DeckCardResolver.MIN_COUNT) {
      const updatedEntity = await this.deckCardService.updateCountById(deckCardEntity.id, deckCardEntity.count - 1);
      return DeckCardPresenter.present(updatedEntity);
    }

    const deletedEntity = await this.deckCardService.delete(deckCardEntity.id);
    return DeckCardPresenter.present(deletedEntity);
  }
}
