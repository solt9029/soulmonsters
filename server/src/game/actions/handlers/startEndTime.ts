import { Phase } from '../../../graphql/index';
import { GameModel } from 'src/models/game.model';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

export function handleStartEndTimeAction(gameModel: GameModel): GameModel {
  gameModel.phase = Phase.END;
  // TODO: userIdをハンドラーの引数として受け取るようにする
  if (gameModel.turnUserId) {
    gameModel = addGameLog(
      gameModel,
      `${getDisplayName(gameModel, gameModel.turnUserId)}がエンドタイムを開始しました。`,
    );
  }
  return gameModel;
}
