import { GameModel } from 'src/models/game.model';
import { addUserEnergy } from 'src/game/mutations/addUserEnergy';
import { Phase } from 'src/graphql';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

export function handleStartEnergyTimeAction(userId: string, gameModel: GameModel): GameModel {
  gameModel = addUserEnergy(gameModel, userId, 2);
  gameModel.phase = Phase.ENERGY;
  gameModel = addGameLog(gameModel, `${getDisplayName(gameModel, userId)}がエナジータイムを開始し、エナジーが2増えました。`);
  return gameModel;
}
