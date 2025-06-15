import { EntityRepository, Repository } from 'typeorm';
import { DeckCardEntity } from '../entities/deck.card.entity';

@EntityRepository(DeckCardEntity)
export class DeckCardRepository extends Repository<DeckCardEntity> {
  /**
   * Find deck cards with relations, using pessimistic lock
   */
  async findDeckCardsWithLock(deckId: number): Promise<DeckCardEntity[]> {
    return await this.createQueryBuilder('deckCards')
      .setLock('pessimistic_read')
      .leftJoinAndSelect('deckCards.card', 'card')
      .leftJoinAndSelect('deckCards.deck', 'deck')
      .where('deckCards.deckId = :deckId', { deckId })
      .getMany();
  }

  /**
   * Calculate total card count in deck
   */
  async getTotalCardCount(deckId: number): Promise<number> {
    const deckCards = await this.find({
      where: { deckId },
      select: ['count'],
    });

    return deckCards.reduce(
      (accumulator, currentValue) => accumulator + currentValue.count,
      0,
    );
  }
}