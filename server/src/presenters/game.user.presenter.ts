import { GameUser, User } from '../graphql';
import { GameUserEntity } from '../entities/game.user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameUserPresenter {
  static present(entity: GameUserEntity, user: User): GameUser {
    return {
      id: entity.id,
      userId: entity.userId,
      user,
      energy: entity.energy,
      lifePoint: entity.lifePoint,
      lastViewedAt: entity.lastViewedAt,
      deck: entity.deck,
      actionTypes: entity.actionTypes,
    };
  }
}
