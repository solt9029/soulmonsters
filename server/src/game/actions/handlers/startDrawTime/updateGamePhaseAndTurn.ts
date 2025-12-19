import { GameModel } from 'src/models/game.model';
import { Phase } from 'src/graphql';

const calcNextGameTurnCount = (gameModel: GameModel): number => {
  return gameModel.turnCount + 1;
};

export const updateGamePhaseAndTurn = (gameModel: GameModel): GameModel => {
  gameModel.phase = Phase.DRAW;
  gameModel.turnCount = calcNextGameTurnCount(gameModel);

  return gameModel;
};
