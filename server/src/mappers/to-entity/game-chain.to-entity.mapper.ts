import { Injectable } from '@nestjs/common';
import { GameChainEntity } from '../../entities/game-chain.entity';
import { GameChainModel } from '../../models/game-chain.model';

@Injectable()
export class GameChainToEntityMapper {
  toEntity(model: GameChainModel): GameChainEntity {
    return new GameChainEntity({
      id: model.id,
      gameId: model.gameId,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
