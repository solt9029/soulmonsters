import { GameUser } from '../graphql';
import { GameUserEntity } from '../entities/game.user.entity';

export class GameUserPresenter {
  static present(entity: GameUserEntity): GameUser {
    return {
      id: entity.id,
      userId: entity.userId,
      user: entity.user,
      energy: entity.energy,
      lifePoint: entity.lifePoint,
      lastViewedAt: entity.lastViewedAt,
      deck: entity.deck,
      actionTypes: entity.actionTypes,
    };
  }
}
