import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { AppEntity } from './app.entity';
import { GameEntity } from './game.entity';

@Entity({ name: 'gameLogs' })
export class GameLogEntity extends AppEntity<GameLogEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => GameEntity,
    game => game.gameLogs,
    { onDelete: 'CASCADE' },
  )
  game: GameEntity;
}
