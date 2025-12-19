import { Phase } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';

export function handleStartPutTimeAction(gameModel: GameModel): GameModel {
  gameModel.phase = Phase.PUT;
  return gameModel;
}
