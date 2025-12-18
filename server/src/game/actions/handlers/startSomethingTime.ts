import { Phase } from '../../../graphql/index';
import { GameModel } from 'src/models/game.model';

export function handleStartSomethingTimeAction(gameModel: GameModel): GameModel {
  gameModel.phase = Phase.SOMETHING;
  return gameModel;
}
