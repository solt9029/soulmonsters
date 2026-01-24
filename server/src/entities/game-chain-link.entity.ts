import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { AppEntity } from './app.entity';
import { GameChainEntity } from './game-chain.entity';
import { GameCardEntity } from './game-card.entity';
import { EffectType } from 'src/graphql/index';

export enum GameChainLinkStatus {
  WAITING = 'WAITING',
  RESOLVING = 'RESOLVING',
  RESOLVED = 'RESOLVED',
}

export type Effect =
  | {
      type: EffectType.RUTERUTE_DRAW;
    }
  | {
      type: EffectType.NATSUKASHINORUDE_POWER_DOWN;
      targetGameCardId: number;
    }
  | {
      type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER;
      targetGameCardId: number;
    }
  | {
      type: EffectType.EMERALD_ENERGY_INCREASE;
    }
  | {
      type: EffectType.FRESH_FISH_DRAW;
    }
  | {
      type: EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION;
      targetGameCardId: number;
    };

@Entity({ name: 'gameChainLinks' })
export class GameChainLinkEntity extends AppEntity<GameChainLinkEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameChainId: number;

  @Column()
  orderIndex: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  gameCardId: number | null;

  @Column('varchar')
  status: GameChainLinkStatus;

  @Column('json')
  effect: Effect;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => GameChainEntity,
    gameChain => gameChain.gameChainLinks,
    { onDelete: 'CASCADE' },
  )
  gameChain: GameChainEntity;

  @ManyToOne(
    () => GameCardEntity,
    gameCard => gameCard.gameChainLinks,
    { nullable: true },
  )
  gameCard: GameCardEntity | null;
}
