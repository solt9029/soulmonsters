import { GameCardEntity } from '../entities/game-card.entity';
import { GameEntity } from '../entities/game.entity';
import { Phase } from '../graphql/index';
import { GameUserModel } from './game-user.model';
import { GameStateModel } from './game-state.model';

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
  gameUsers: GameUserModel[] = [];
  gameCards: GameCardEntity[] = [];
  gameStates: GameStateModel[] = [];

  // TODO: 一時的なメソッド。今後、GameEntityへの依存を完全に削除する際にこのメソッドも削除する
  toEntity(): GameEntity {
    return new GameEntity({
      id: this.id,
      turnUserId: this.turnUserId,
      phase: this.phase,
      winnerUserId: this.winnerUserId,
      turnCount: this.turnCount,
      startedAt: this.startedAt ?? undefined,
      endedAt: this.endedAt ?? undefined,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      gameUsers: this.gameUsers.map(model => model.toEntity()),
      gameCards: this.gameCards,
      gameStates: this.gameStates.map(model => model.toEntity()),
    });
  }
}
