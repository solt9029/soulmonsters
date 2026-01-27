import { Injectable } from '@nestjs/common';
import { GameEntity } from '../../entities/game.entity';
import { GameModel } from '../../models/game.model';
import { GameUserToModelMapper } from './game-user.to-model.mapper';
import { GameCardToModelMapper } from './game-card.to-model.mapper';
import { GameStateToModelMapper } from './game-state.to-model.mapper';
import { GameChainToModelMapper } from './game-chain.to-model.mapper';
import { GamePendingEffectToModelMapper } from './game-pending-effect.to-model.mapper';

@Injectable()
export class GameToModelMapper {
  constructor(
    private readonly gameUserToModelMapper: GameUserToModelMapper,
    private readonly gameCardToModelMapper: GameCardToModelMapper,
    private readonly gameStateToModelMapper: GameStateToModelMapper,
    private readonly gameChainToModelMapper: GameChainToModelMapper,
    private readonly gamePendingEffectToModelMapper: GamePendingEffectToModelMapper,
  ) {}

  toModel(entity: GameEntity): GameModel {
    return new GameModel({
      id: entity.id,
      turnUserId: entity.turnUserId,
      phase: entity.phase,
      winnerUserId: entity.winnerUserId,
      turnCount: entity.turnCount,
      startedAt: entity.startedAt,
      endedAt: entity.endedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      gameUsers: (entity.gameUsers ?? []).map(e => this.gameUserToModelMapper.toModel(e)),
      gameCards: (entity.gameCards ?? []).map(e => this.gameCardToModelMapper.toModel(e)),
      gameStates: (entity.gameStates ?? []).map(e => this.gameStateToModelMapper.toModel(e)),
      gameChains: (entity.gameChains ?? []).map(e => this.gameChainToModelMapper.toModel(e)),
      gamePendingEffects: (entity.gamePendingEffects ?? []).map(e => this.gamePendingEffectToModelMapper.toModel(e)),
    });
  }
}
