import { Injectable } from '@nestjs/common';
import { GameChainLinkEntity } from '../../entities/game-chain-link.entity';
import { GameChainLinkModel } from '../../models/game-chain-link.model';

@Injectable()
export class GameChainLinkToModelMapper {
  toModel(entity: GameChainLinkEntity): GameChainLinkModel {
    return new GameChainLinkModel({
      id: entity.id,
      gameChainId: entity.gameChainId,
      orderIndex: entity.orderIndex,
      userId: entity.userId,
      gameCardId: entity.gameCardId,
      status: entity.status,
      effect: entity.effect,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
