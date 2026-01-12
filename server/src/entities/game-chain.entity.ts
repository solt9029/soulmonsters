import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { AppEntity } from './app.entity';
import { GameEntity } from './game.entity';
import { GameChainLinkEntity } from './game-chain-link.entity';

export enum GameChainStatus {
  BUILDING = 'BUILDING',
  RESOLVING = 'RESOLVING',
  RESOLVED = 'RESOLVED',
}

@Entity({ name: 'gameChains' })
export class GameChainEntity extends AppEntity<GameChainEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column('varchar')
  status: GameChainStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => GameEntity, game => game.gameChains, { onDelete: 'CASCADE' })
  game: GameEntity;

  @OneToMany(() => GameChainLinkEntity, gameChainLink => gameChainLink.gameChain, { cascade: true })
  gameChainLinks: GameChainLinkEntity[];
}
