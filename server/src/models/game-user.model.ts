import { ActionType } from '../graphql/index';
import { DeckEntity } from '../entities/deck.entity';
import { GameUserEntity } from '../entities/game-user.entity';

export class GameUserModel {
  constructor(partial?: Partial<GameUserModel>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: string;
  energy: number;
  lifePoint: number;
  lastViewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deck: DeckEntity;
  actionTypes: ActionType[];

  toEntity(): GameUserEntity {
    return new GameUserEntity({
      id: this.id,
      userId: this.userId,
      energy: this.energy,
      lifePoint: this.lifePoint,
      lastViewedAt: this.lastViewedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deck: this.deck,
    });
  }
}
