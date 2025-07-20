import { AppDataSource } from '../dataSource';
import { DeckCardEntity } from '../entities/deck.card.entity';

export const DeckCardRepository = AppDataSource.getRepository(DeckCardEntity);
