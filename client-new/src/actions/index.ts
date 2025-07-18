import GameCardListModal from '../models/GameCardListModal';
import { ApolloError } from '@apollo/client';
import { type ErrorName } from '../models/AppState';
import DeckModal from '../models/DeckModal';
import User from '../models/User';
import ActionStatus from '../models/ActionStatus';
import GameCardModal from '../models/GameCardModal';

type Action =
  | {
      type: 'SET_USER';
      payload: User;
    }
  | {
      type: 'SET_SELECTED_DECK_ID';
      payload: number | null;
    }
  | {
      type: 'SET_ERROR';
      payload: {
        name: ErrorName;
        error: ApolloError;
      };
    }
  | {
      type: 'RESET_ERROR';
      payload: ErrorName;
    }
  | {
      type: 'SET_DECK_MODAL';
      payload: DeckModal;
    }
  | {
      type: 'SET_ACTION_STATUS';
      payload: ActionStatus;
    }
  | {
      type: 'SET_GAME_CARD_MODAL';
      payload: GameCardModal;
    }
  | {
      type: 'SET_GAME_CARD_LIST_MODAL';
      payload: GameCardListModal;
    }
  | { type: 'CLOSE_GAME_MODAL' };

export type { Action as default };
