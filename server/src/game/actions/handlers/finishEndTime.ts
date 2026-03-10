import { GameModel } from '../../../models/game.model';
import { switchToOpponentTurn } from '../../mutations/switchToOpponentTurn';
import { cleanGameStates } from '../../mutations/cleanGameStates';
import { GameUserModel } from '../../../models/game-user.model';
import { addGameLog } from 'src/game/mutations/addGameLog';

export type FinishEndTimeActionPayload = {
  gameUser: GameUserModel;
  opponentGameUser: GameUserModel;
};

export function handleFinishEndTimeAction(payload: FinishEndTimeActionPayload, gameModel: GameModel): GameModel {
  switchToOpponentTurn(gameModel, payload.opponentGameUser);
  cleanGameStates(gameModel, payload.gameUser);
  gameModel = addGameLog(gameModel, `${payload.gameUser.displayName}がターンを終了しました。`);
  return gameModel;
}
