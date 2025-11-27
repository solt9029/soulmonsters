import { Game, User } from '../graphql';
import { GameEntity } from '../entities/game.entity';
import { GameUserPresenter } from './game.user.presenter';
import { GameCardPresenter } from './game.card.presenter';

export class GamePresenter {
  static present(entity: GameEntity, users: User[]): Game {
    const gameUsers = entity.gameUsers.map(gameUser => {
      const user = users.find(u => u.id === gameUser.userId);

      if (!user) {
        throw new Error(`User not found for userId: ${gameUser.userId}`);
      }

      return GameUserPresenter.present(gameUser, user);
    });

    return {
      id: entity.id,
      phase: entity.phase,
      turnUserId: entity.turnUserId,
      winnerUserId: entity.winnerUserId,
      startedAt: entity.startedAt,
      endedAt: entity.endedAt,
      gameUsers,
      gameCards: entity.gameCards.map(GameCardPresenter.present),
    };
  }
}
