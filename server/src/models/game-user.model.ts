import { ActionType } from '../graphql/index';
import { DeckModel } from './deck.model';

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
