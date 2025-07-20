import { GameUser, ActionType } from './../graphql/index';
import { DeckEntity } from './deck.entity';
import { GameEntity } from './game.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'gameUsers' })
@Unique(['userId', 'game'])
@Unique(['deck', 'game'])
export class GameUserEntity extends GameUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  energy: number;

  @Column({ default: 8000 })
  lifePoint: number;

  @Column()
  lastViewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => DeckEntity,
    deckEntity => deckEntity.gameUsers,
  )
  deck: DeckEntity;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.gameUsers,
    { onDelete: 'CASCADE' },
  )
  game: GameEntity;

  actionTypes: ActionType[] = [];
}
