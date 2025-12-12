import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { switchToOpponentTurn } from './finishEndTime/switchToOpponentTurn';
import { cleanGameStates } from './finishEndTime/cleanGameStates';
import { GameUserModel } from '../../../models/game-user.model';

export type FinishEndTimeActionPayload = {
  gameUser: GameUserModel;
  opponentGameUser: GameUserModel;
};

export async function handleFinishEndTimeAction(
  manager: EntityManager,
  payload: FinishEndTimeActionPayload,
  gameModel: GameModel,
) {
  switchToOpponentTurn(gameModel, payload.opponentGameUser);
  cleanGameStates(gameModel, payload.gameUser);

  await manager.save(gameModel.toEntity());
}
