import { Phase } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

export function handleStartPutTimeAction(gameModel: GameModel): GameModel {
  gameModel.phase = Phase.PUT;
  // TODO: userIdをハンドラーの引数として受け取るようにする
  if (gameModel.turnUserId) {
    gameModel = addGameLog(gameModel, `${getDisplayName(gameModel, gameModel.turnUserId)}がプットタイムを開始しました。`);
  }
  return gameModel;
}
