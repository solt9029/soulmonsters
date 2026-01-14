import { GameEntity } from '../entities/game.entity';
import { Phase } from '../graphql/index';
import { GameUserModel } from './game-user.model';
import { GameStateModel } from './game-state.model';
import { GameCardModel } from './game-card.model';
import { GameChainModel } from './game-chain.model';
import { GamePendingEffectModel } from './game-pending-effect.model';
import { GameToEntityMapper } from '../mappers/to-entity/game.to-entity.mapper';
import { GameUserToEntityMapper } from '../mappers/to-entity/game-user.to-entity.mapper';
import { GameCardToEntityMapper } from '../mappers/to-entity/game-card.to-entity.mapper';
import { GameStateToEntityMapper } from '../mappers/to-entity/game-state.to-entity.mapper';
import { DeckToEntityMapper } from '../mappers/to-entity/deck.to-entity.mapper';
import { GameChainToEntityMapper } from 'src/mappers/to-entity/game-chain.to-entity.mapper';
import { GameChainLinkToEntityMapper } from 'src/mappers/to-entity/game-chain-link.to-entity.mapper';

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
  gameChains: GameChainModel[] = [];
  gamePendingEffects: GamePendingEffectModel[] = [];

  toEntity(): GameEntity {
    const mapper = new GameToEntityMapper(
      new GameUserToEntityMapper(new DeckToEntityMapper()),
      new GameCardToEntityMapper(),
      new GameStateToEntityMapper(),
      new GameChainToEntityMapper(new GameChainLinkToEntityMapper()),
    );
    return mapper.toEntity(this);
  }
}
