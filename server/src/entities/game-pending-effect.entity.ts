import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { AppEntity } from './app.entity';
import { GameEntity } from './game.entity';
import { GameCardEntity } from './game-card.entity';
import { EffectType } from '../graphql/index';

@Entity({ name: 'gamePendingEffects' })
export class GamePendingEffectEntity extends AppEntity<GamePendingEffectEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  gameCardId: number | null;

  @Column('varchar')
  effectType: EffectType;

  @CreateDateColumn()
  createdAt: Date;

  // memo:
  // orphanedRowActionの設定によって、
  // game.gamePendingEffects = [] などでgameの保存処理を実行すると、
  // gameに紐づくgamePendingEffectsが削除されるようになる
  @ManyToOne(
    () => GameEntity,
    game => game.gamePendingEffects,
    { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
  )
  game: GameEntity;

  @ManyToOne(
    () => GameCardEntity,
    gameCard => gameCard.gamePendingEffects,
    { nullable: true },
  )
  gameCard: GameCardEntity | null;
}
