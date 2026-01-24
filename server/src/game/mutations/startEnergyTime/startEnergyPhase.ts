import { GameModel } from 'src/models/game.model';
import { Phase } from 'src/graphql';

export const startEnergyPhase = (gameModel: GameModel): GameModel => {
  gameModel.phase = Phase.ENERGY;
  return gameModel;
};
