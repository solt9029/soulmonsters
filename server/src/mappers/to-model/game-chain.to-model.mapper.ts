import { Injectable } from '@nestjs/common';
import { GameChainEntity } from '../../entities/game-chain.entity';
import { GameChainModel } from '../../models/game-chain.model';
import { GameChainLinkToModelMapper } from './game-chain-link.to-model.mapper';

@Injectable()
export class GameChainToModelMapper {
  constructor(private readonly gameChainLinkToModelMapper: GameChainLinkToModelMapper) {}

  toModel(entity: GameChainEntity): GameChainModel {
    return new GameChainModel({
      id: entity.id,
      gameId: entity.gameId,
      status: entity.status,
      gameChainLinks: (entity.gameChainLinks ?? []).map(e => this.gameChainLinkToModelMapper.toModel(e)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
