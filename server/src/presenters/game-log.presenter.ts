import { GameLog } from '../graphql';
import { GameLogModel } from '../models/game-log.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameLogPresenter {
  present(model: GameLogModel): GameLog {
    return {
      id: model.id,
      gameId: model.gameId,
      message: model.message,
      createdAt: model.createdAt,
    };
  }
}
