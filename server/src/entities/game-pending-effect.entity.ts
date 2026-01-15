import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { AppEntity } from './app.entity';
import { GameEntity } from './game.entity';
import { GameCardEntity } from './game-card.entity';

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
  effectType: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => GameEntity,
    game => game.gamePendingEffects,
    { onDelete: 'CASCADE' },
  )
  game: GameEntity;

  @ManyToOne(
    () => GameCardEntity,
    gameCard => gameCard.gamePendingEffects,
    { nullable: true },
  )
  gameCard: GameCardEntity | null;
}
