import AppState from './models/AppState';
import Action from './actions';

export default function (state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return state.setUser(action.payload);
    case 'SET_SELECTED_DECK_ID':
      return state.setSelectedDeckId(action.payload);
    case 'SET_ERROR':
      return state.setError(action.payload);
    case 'RESET_ERROR':
      return state.resetError(action.payload);
    case 'SET_DECK_MODAL':
      return state.setDeckModal(action.payload);
    case 'SET_GAME_CARD_MODAL':
      return state.setGameCardModal(action.payload);
    case 'SET_GAME_CARD_LIST_MODAL':
      return state.setGameCardListModal(action.payload);
    case 'CLOSE_GAME_MODAL':
      return state.closeGameModal();
    case 'SET_ACTION_STATUS':
      return state.setActionStatus(action.payload);
    default:
      return state;
  }
}
