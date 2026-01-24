import { Injectable } from '@nestjs/common';
import { GamePendingEffectEntity } from '../../entities/game-pending-effect.entity';
import { GamePendingEffectModel } from '../../models/game-pending-effect.model';
import { EffectType } from '../../graphql/index';

@Injectable()
export class GamePendingEffectToModelMapper {
  toModel(entity: GamePendingEffectEntity): GamePendingEffectModel {
    return new GamePendingEffectModel({
      id: entity.id,
      gameId: entity.gameId,
      userId: entity.userId,
      gameCardId: entity.gameCardId,
      effectType: entity.effectType as EffectType,
      createdAt: entity.createdAt,
    });
  }
}
