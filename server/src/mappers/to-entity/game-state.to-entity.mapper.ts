import { Injectable } from '@nestjs/common';
import { GameStateEntity } from '../../entities/game-state.entity';
import { GameStateModel } from '../../models/game-state.model';

@Injectable()
export class GameStateToEntityMapper {
  toEntity(model: GameStateModel): GameStateEntity {
    return new GameStateEntity({
      id: model.id,
      gameCardId: model.gameCardId,
      state: model.state,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
