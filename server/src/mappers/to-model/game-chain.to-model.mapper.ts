import { Injectable } from '@nestjs/common';
import { GameChainEntity } from '../../entities/game-chain.entity';
import { GameChainModel } from '../../models/game-chain.model';

@Injectable()
export class GameChainToModelMapper {
  toModel(entity: GameChainEntity): GameChainModel {
    return new GameChainModel({
      id: entity.id,
      gameId: entity.gameId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
