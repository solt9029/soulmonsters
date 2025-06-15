import { GameEntity } from './game.entity';
import { GameCardEntity } from './game.card.entity';
import { StateType } from '../graphql/index';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

type State =
  | {
      type: StateType.ATTACK_COUNT;
      data: { value: number };
    }
  | {
      type: StateType.SELF_POWER_CHANGE;
      data: { attack: number; defence: number };
    }
  | {
      type: StateType.PUT_SOUL_COUNT;
      data: { value: number; gameUserId: number };
    };

@Entity({ name: 'gameStates' })
export class GameStateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => GameEntity,
    gameEntity => gameEntity.gameStates,
    { onDelete: 'CASCADE', nullable: false },
  )
  game: GameEntity;

  @ManyToOne(
    () => GameCardEntity,
    gameCardEntity => gameCardEntity.gameStates,
    { onDelete: 'CASCADE', nullable: true },
  )
  gameCard: GameCardEntity;

  @Column({ type: 'json' })
  state: State;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
