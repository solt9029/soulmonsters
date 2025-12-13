import { ActionType } from '../graphql/index';
import { GameUserEntity } from '../entities/game-user.entity';
import { DeckModel } from './deck.model';
import { GameUserToEntityMapper } from '../mappers/to-entity/game-user.to-entity.mapper';
import { DeckToEntityMapper } from '../mappers/to-entity/deck.to-entity.mapper';

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
  deck: DeckModel;
  actionTypes: ActionType[];
}
