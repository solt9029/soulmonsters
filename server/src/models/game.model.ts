import { GameStateEntity } from '../entities/game-state.entity';
import { GameCardEntity } from '../entities/game-card.entity';
import { GameUserEntity } from '../entities/game-user.entity';
import { Phase } from '../graphql/index';

export class GameModel {
  constructor(partial?: Partial<GameModel>) {
    Object.assign(this, partial);
  }

  id: number;
  turnUserId: string | null;
  phase: Phase | null;
  winnerUserId: string | null;
  turnCount: number;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  gameUsers: GameUserEntity[];
  gameCards: GameCardEntity[];
  gameStates: GameStateEntity[];
}
