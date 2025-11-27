import { Game } from '../graphql';
import { GameEntity } from '../entities/game.entity';
import { GameUserPresenter } from './game.user.presenter';
import { GameCardPresenter } from './game.card.presenter';

export class GamePresenter {
  static present(entity: GameEntity): Game {
    return {
      id: entity.id,
      phase: entity.phase,
      turnUserId: entity.turnUserId,
      winnerUserId: entity.winnerUserId,
      startedAt: entity.startedAt,
      endedAt: entity.endedAt,
      gameUsers: entity.gameUsers.map(GameUserPresenter.present),
      gameCards: entity.gameCards.map(GameCardPresenter.present),
    };
  }
}
