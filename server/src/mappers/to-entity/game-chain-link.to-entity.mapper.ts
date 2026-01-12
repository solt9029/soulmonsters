import { Injectable } from '@nestjs/common';
import { GameChainLinkEntity } from '../../entities/game-chain-link.entity';
import { GameChainLinkModel } from '../../models/game-chain-link.model';

@Injectable()
export class GameChainLinkToEntityMapper {
  toEntity(model: GameChainLinkModel): GameChainLinkEntity {
    return new GameChainLinkEntity({
      id: model.id,
      gameChainId: model.gameChainId,
      orderIndex: model.orderIndex,
      userId: model.userId,
      gameCardId: model.gameCardId,
      status: model.status,
      effect: model.effect,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
