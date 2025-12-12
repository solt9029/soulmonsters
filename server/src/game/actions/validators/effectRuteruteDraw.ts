import { ActionType, GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';

export function validateEffectRuteruteDrawAction(data: GameActionDispatchInput, game: GameModel) {
  // check payload
  const { gameCardId } = data.payload;
  const gameCard = game.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (!gameCard) {
    throw new Error(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_RUTERUTE_DRAW)) {
    throw new Error('The specified game card does not have the EFFECT_RUTERUTE_DRAW action type');
  }
}
