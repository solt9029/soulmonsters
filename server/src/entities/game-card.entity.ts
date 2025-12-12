import { GameStateEntity } from './game-state.entity';
import { GameEntity } from './game.entity';
import { CardEntity } from './card.entity';
import { Zone, BattlePosition, Kind, Type, Attribute } from '../graphql/index';
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
import { AppEntity } from './app.entity';

@Entity({ name: 'gameCards' })
@Unique(['position', 'zone', 'currentUserId'])
export class GameCardEntity extends AppEntity<GameCardEntity> {
  constructor(partial?: Partial<GameCardEntity>) {
    super(partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  // TODO: これ、gameUserIdにした方が良いのでは？
  @Column()
  originalUserId: string;

  // TODO: これ、gameUserIdにした方が良いのでは？
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

  name?: string | null;
  kind?: Kind | null;
  type?: Type | null;
  attribute?: Attribute | null;
  attack?: number | null;
  defence?: number | null;
  cost?: number | null;
  detail?: string | null;
}
