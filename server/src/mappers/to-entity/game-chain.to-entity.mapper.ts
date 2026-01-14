import { Injectable } from '@nestjs/common';
import { GameChainEntity } from '../../entities/game-chain.entity';
import { GameChainModel } from '../../models/game-chain.model';
import { GameChainLinkToEntityMapper } from './game-chain-link.to-entity.mapper';

@Injectable()
export class GameChainToEntityMapper {
  constructor(private readonly gameChainLinkToEntityMapper: GameChainLinkToEntityMapper) {}

  toEntity(model: GameChainModel): GameChainEntity {
    return new GameChainEntity({
      id: model.id,
      gameId: model.gameId,
      status: model.status,
      gameChainLinks: (model.gameChainLinks ?? []).map(m => this.gameChainLinkToEntityMapper.toEntity(m)),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
