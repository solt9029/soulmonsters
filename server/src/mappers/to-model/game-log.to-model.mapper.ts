import { Injectable } from '@nestjs/common';
import { GameLogEntity } from '../../entities/game-log.entity';
import { GameLogModel } from '../../models/game-log.model';

@Injectable()
export class GameLogToModelMapper {
  toModel(entity: GameLogEntity): GameLogModel {
    return new GameLogModel({
      id: entity.id,
      gameId: entity.gameId,
      message: entity.message,
      createdAt: entity.createdAt,
    });
  }
}
