import { Injectable } from '@nestjs/common';
import { GameStateEntity } from '../../entities/game-state.entity';
import { GameStateModel } from '../../models/game-state.model';

@Injectable()
export class GameStateToModelMapper {
  toModel(entity: GameStateEntity): GameStateModel {
    return new GameStateModel({
      id: entity.id,
      gameCardId: entity.gameCardId,
      state: entity.state,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
