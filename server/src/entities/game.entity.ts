import { GameStateEntity } from './game-state.entity';
import { GameCardEntity } from './game-card.entity';
import { GameUserEntity } from './game-user.entity';
import { Phase } from './../graphql/index';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AppEntity } from './app.entity';

@Entity({ name: 'games' })
export class GameEntity extends AppEntity<GameEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  turnUserId: string | null;

  @Column({ type: 'varchar', nullable: true })
  phase: Phase | null;

  @Column({ type: 'varchar', nullable: true })
  winnerUserId: string | null;

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
    { cascade: true },
  )
  gameUsers: GameUserEntity[];

  @OneToMany(
    () => GameCardEntity,
    gameCardEntity => gameCardEntity.game,
    { cascade: true },
  )
  gameCards: GameCardEntity[];

  @OneToMany(
    () => GameStateEntity,
    gameStateEntity => gameStateEntity.game,
    { cascade: true },
  )
  gameStates: GameStateEntity[];
}
