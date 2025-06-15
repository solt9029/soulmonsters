import { GameStateEntity } from './game.state.entity';
import { GameEntity } from './game.entity';
import { CardEntity } from './card.entity';
import { Zone, BattlePosition, GameCard } from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'gameCards' })
@Unique(['position', 'zone', 'currentUserId'])
export class GameCardEntity extends GameCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUserId: string;

  @Column()
  currentUserId: string;

  @Column()
  zone: Zone;

  @Column()
  position: number;

  @Column({ nullable: true })
  battlePosition: BattlePosition;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => CardEntity,
    cardEntity => cardEntity.gameCards,
  )
  card: CardEntity;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.gameCards,
    { onDelete: 'CASCADE' },
  )
  game: GameEntity;

  @OneToMany(
    () => GameStateEntity,
    gameStateEntity => gameStateEntity.gameCard,
  )
  gameStates: GameStateEntity[];

  actionTypes = [];
}
