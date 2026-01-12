import { GameChainToEntityMapper } from './game-chain.to-entity.mapper';
import { Injectable } from '@nestjs/common';
import { GameEntity } from '../../entities/game.entity';
import { GameModel } from '../../models/game.model';
import { GameUserToEntityMapper } from './game-user.to-entity.mapper';
import { GameCardToEntityMapper } from './game-card.to-entity.mapper';
import { GameStateToEntityMapper } from './game-state.to-entity.mapper';

@Injectable()
export class GameToEntityMapper {
  constructor(
    private readonly gameUserToEntityMapper: GameUserToEntityMapper,
    private readonly gameCardToEntityMapper: GameCardToEntityMapper,
    private readonly gameStateToEntityMapper: GameStateToEntityMapper,
    private readonly gameChainToEntityMapper: GameChainToEntityMapper,
  ) {}

  toEntity(model: GameModel): GameEntity {
    return new GameEntity({
      id: model.id,
      turnUserId: model.turnUserId,
      phase: model.phase,
      winnerUserId: model.winnerUserId,
      turnCount: model.turnCount,
      startedAt: model.startedAt ?? undefined,
      endedAt: model.endedAt ?? undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      gameUsers: model.gameUsers.map(m => this.gameUserToEntityMapper.toEntity(m)),
      gameCards: model.gameCards.map(m => this.gameCardToEntityMapper.toEntity(m)),
      gameStates: model.gameStates.map(m => this.gameStateToEntityMapper.toEntity(m)),
      gameChains: model.gameChains.map(m => this.gameChainToEntityMapper.toEntity(m)), // TODO: gameChainLinkもマッピングしてあげる
    });
  }
}
