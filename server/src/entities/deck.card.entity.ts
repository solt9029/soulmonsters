import { DeckEntity } from './deck.entity';
import { CardEntity } from './card.entity';
import { DeckCard } from './../graphql/index';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AppEntity } from './app.entity';

@Entity({ name: 'deckCards' })
@Unique(['card', 'deck'])
export class DeckCardEntity extends AppEntity<DeckCardEntity> implements DeckCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => CardEntity,
    cardEntity => cardEntity.deckCards,
  )
  card: CardEntity;

  @ManyToOne(
    () => DeckEntity,
    deckEntity => deckEntity.deckCards,
  )
  deck: DeckEntity;
}
