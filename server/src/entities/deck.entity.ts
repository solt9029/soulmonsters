import { GameUserEntity } from './game.user.entity';
import { DeckCardEntity } from './deck.card.entity';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { AppEntity } from './app.entity';

@Entity({ name: 'decks' })
export class DeckEntity extends AppEntity<DeckEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ length: 64 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => DeckCardEntity,
    deckCardEntity => deckCardEntity.deck,
  )
  deckCards: DeckCardEntity[];

  @OneToMany(
    () => GameUserEntity,
    gameUserEntity => gameUserEntity.deck,
  )
  gameUsers: GameUserEntity[];
}
