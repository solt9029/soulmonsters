import { Game, User } from '../graphql';
import { GameEntity } from '../entities/game.entity';
import { GameUserPresenter } from './game.user.presenter';
import { GameCardPresenter } from './game.card.presenter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamePresenter {
  constructor(
    private readonly gameUserPresenter: GameUserPresenter,
    private readonly gameCardPresenter: GameCardPresenter,
  ) {}

  present(entity: GameEntity, users: User[]): Game {
    const gameUsers = entity.gameUsers.map(gameUser => {
      const user = users.find(u => u.id === gameUser.userId);

      if (!user) {
        throw new Error(`User not found for userId: ${gameUser.userId}`);
      }

      return this.gameUserPresenter.present(gameUser, user);
    });

    return {
      id: entity.id,
      phase: entity.phase,
      turnUserId: entity.turnUserId,
      winnerUserId: entity.winnerUserId,
      startedAt: entity.startedAt,
      endedAt: entity.endedAt,
      gameUsers,
      gameCards: entity.gameCards.map(gameCard => this.gameCardPresenter.present(gameCard)),
    };
  }
}
