import { Phase } from '../../../graphql/index';
import { GameModel } from 'src/models/game.model';

export function handleStartEndTimeAction(gameModel: GameModel): GameModel {
  gameModel.phase = Phase.END;
  return gameModel;
}
