import { Injectable } from '@nestjs/common';
import { GameLogEntity } from '../../entities/game-log.entity';
import { GameLogModel } from '../../models/game-log.model';

@Injectable()
export class GameLogToEntityMapper {
  toEntity(model: GameLogModel): GameLogEntity {
    return new GameLogEntity({
      id: model.id,
      gameId: model.gameId,
      message: model.message,
      createdAt: model.createdAt,
    });
  }
}
