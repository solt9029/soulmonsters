import { DeckCardEntity } from './deck.card.entity';
import { Kind, Type, Attribute } from './../graphql/index';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GameCardEntity } from './game.card.entity';
import { AppEntity } from './app.entity';

@Entity({ name: 'cards' })
export class CardEntity extends AppEntity<CardEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  kind: Kind;

  @Column()
  type: Type;

  @Column({ nullable: true })
  attribute: Attribute;

  @Column({ nullable: true })
  attack: number;

  @Column({ nullable: true })
  defence: number;

  @Column({ nullable: true })
  cost: number;

  @Column('text', { nullable: true })
  detail: string;

  @Column('text')
  picture: string;

  @OneToMany(
    () => DeckCardEntity,
    deckCardEntity => deckCardEntity.card,
  )
  deckCards: DeckCardEntity[];

  @OneToMany(
    () => GameCardEntity,
    gameCardEntity => gameCardEntity.card,
  )
  gameCards: GameCardEntity[];
}
