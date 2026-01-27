import { Injectable } from '@nestjs/common';
import { GamePendingEffectEntity } from '../../entities/game-pending-effect.entity';
import { GamePendingEffectModel } from '../../models/game-pending-effect.model';

@Injectable()
export class GamePendingEffectToEntityMapper {
  toEntity(model: GamePendingEffectModel): GamePendingEffectEntity {
    return new GamePendingEffectEntity({
      id: model.id,
      gameId: model.gameId,
      userId: model.userId,
      gameCardId: model.gameCardId,
      effectType: model.effectType,
      createdAt: model.createdAt,
    });
  }
}
