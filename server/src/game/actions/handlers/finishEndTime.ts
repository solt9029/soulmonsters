import { GameModel } from '../../../models/game.model';
import { switchToOpponentTurn } from '../../mutations/switchToOpponentTurn';
import { cleanGameStates } from '../../mutations/cleanGameStates';
import { GameUserModel } from '../../../models/game-user.model';

export type FinishEndTimeActionPayload = {
  gameUser: GameUserModel;
  opponentGameUser: GameUserModel;
};

export function handleFinishEndTimeAction(payload: FinishEndTimeActionPayload, gameModel: GameModel): GameModel {
  switchToOpponentTurn(gameModel, payload.opponentGameUser);
  cleanGameStates(gameModel, payload.gameUser);
  return gameModel;
}
