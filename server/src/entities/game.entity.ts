import { GameStateEntity } from './game.state.entity';
import { GameCardEntity } from './game.card.entity';
import { GameUserEntity } from './game.user.entity';
import { Game, Phase } from './../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'games' })
export class GameEntity extends Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  turnUserId: string;

  @Column({ nullable: true })
  phase: Phase;

  @Column({ nullable: true })
  winnerUserId: string;

  @Column({ default: 0 })
  turnCount: number;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => GameUserEntity,
    gameUserEntity => gameUserEntity.game,
  )
  gameUsers: GameUserEntity[];

  @OneToMany(
    () => GameCardEntity,
    gameCardEntity => gameCardEntity.game,
  )
  gameCards: GameCardEntity[];

  @OneToMany(
    () => GameStateEntity,
    gameStateEntity => gameStateEntity.game,
  )
  gameStates: GameStateEntity[];
}
