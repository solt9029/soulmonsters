import { EntityRepository, Repository } from 'typeorm';
import { DeckCardEntity } from '../entities/deck.card.entity';

@EntityRepository(DeckCardEntity)
export class DeckCardRepository extends Repository<DeckCardEntity> {}
