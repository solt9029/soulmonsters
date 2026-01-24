import { GameModel } from '../../../models/game.model';
import { drawCardFromDeck } from 'src/game/mutations/drawCardFromDeck';
import { Phase } from 'src/graphql';

export function handleStartDrawTimeAction(userId: string, gameModel: GameModel): GameModel {
  gameModel.phase = Phase.DRAW;
  gameModel.turnCount = gameModel.turnCount + 1;
  gameModel = drawCardFromDeck(gameModel, userId);
  return gameModel;
}
