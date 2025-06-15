import { GameCardFragment } from '../graphql/generated/graphql-client';
import { Record } from 'immutable';

export interface GameCardModalInterface {
  data?: GameCardFragment;
  isOpen: boolean;
}

export default class GameCardModal extends Record<GameCardModalInterface>(
  {
    data: undefined,
    isOpen: false,
  },
  'GameCardModal'
) {
  open(data: GameCardFragment): GameCardModal {
    return new GameCardModal({ data, isOpen: true });
  }
  close(): GameCardModal {
    return this.set('isOpen', false);
  }
}
