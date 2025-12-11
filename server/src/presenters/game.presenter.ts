import { Game, User } from '../graphql';
import { GameModel } from '../models/game.model';
import { GameUserPresenter } from './game-user.presenter';
import { GameCardPresenter } from './game-card.presenter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamePresenter {
  constructor(
    private readonly gameUserPresenter: GameUserPresenter,
    private readonly gameCardPresenter: GameCardPresenter,
  ) {}

  present(model: GameModel, users: User[]): Game {
    const gameUsers = model.gameUsers.map(gameUser => {
      const user = users.find(u => u.id === gameUser.userId);

      if (!user) {
        throw new Error(`User not found for userId: ${gameUser.userId}`);
      }

      return this.gameUserPresenter.present(gameUser, user);
    });

    return {
      id: model.id,
      phase: model.phase,
      turnUserId: model.turnUserId,
      winnerUserId: model.winnerUserId,
      startedAt: model.startedAt,
      endedAt: model.endedAt,
      gameUsers,
      gameCards: model.gameCards.map(gameCard => this.gameCardPresenter.present(gameCard)),
    };
  }
}
