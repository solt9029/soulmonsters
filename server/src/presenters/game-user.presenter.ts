import { GameUser, User } from '../graphql';
import { GameUserModel } from '../models/game-user.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameUserPresenter {
  present(model: GameUserModel, user: User): GameUser {
    return {
      id: model.id,
      userId: model.userId,
      user,
      energy: model.energy,
      lifePoint: model.lifePoint,
      lastViewedAt: model.lastViewedAt,
      deck: model.deck,
      actionTypes: model.actionTypes,
    };
  }
}
