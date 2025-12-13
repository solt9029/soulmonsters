import { GameEntity } from '../entities/game.entity';
import { Phase } from '../graphql/index';
import { GameUserModel } from './game-user.model';
import { GameStateModel } from './game-state.model';
import { GameCardModel } from './game-card.model';
import { GameToEntityMapper } from '../mappers/to-entity/game.to-entity.mapper';
import { GameUserToEntityMapper } from '../mappers/to-entity/game-user.to-entity.mapper';
import { GameCardToEntityMapper } from '../mappers/to-entity/game-card.to-entity.mapper';
import { GameStateToEntityMapper } from '../mappers/to-entity/game-state.to-entity.mapper';
import { DeckToEntityMapper } from '../mappers/to-entity/deck.to-entity.mapper';
import { CardToEntityMapper } from '../mappers/to-entity/card.to-entity.mapper';

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
  gameCards: GameCardModel[] = [];
  gameStates: GameStateModel[] = [];

  toEntity(): GameEntity {
    const mapper = new GameToEntityMapper(
      new GameUserToEntityMapper(new DeckToEntityMapper()),
      new GameCardToEntityMapper(new CardToEntityMapper()),
      new GameStateToEntityMapper(),
    );
    return mapper.toEntity(this);
  }
}
