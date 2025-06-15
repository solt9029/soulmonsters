import { GameCardFragment } from '../graphql/generated/graphql-client';
import { Record } from 'immutable';

export interface GameCardListModalInterface {
  data: GameCardFragment[];
  isOpen: boolean;
}

export default class GameCardListModal extends Record<
  GameCardListModalInterface
>(
  {
    data: [],
    isOpen: false,
  },
  'GameCardListModal'
) {
  open(data: GameCardFragment[]): GameCardListModal {
    return new GameCardListModal({ data, isOpen: true });
  }
  close(): GameCardListModal {
    return this.set('isOpen', false);
  }
}
