import { Phase } from '../../../graphql/index';
import { GameModel } from 'src/models/game.model';

export function handleStartBattleTimeAction(gameModel: GameModel): GameModel {
  gameModel.phase = Phase.BATTLE;
  return gameModel;
}
