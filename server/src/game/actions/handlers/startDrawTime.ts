import { GameModel } from '../../../models/game.model';
import { drawCardFromDeck } from './startDrawTime/drawCardFromDeck';
import { updateGamePhaseAndTurn } from './startDrawTime/updateGamePhaseAndTurn';

export function handleStartDrawTimeAction(userId: string, gameModel: GameModel): GameModel {
  gameModel = updateGamePhaseAndTurn(gameModel);
  gameModel = drawCardFromDeck(gameModel, userId);
  return gameModel;
}
