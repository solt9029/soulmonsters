import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { switchToOpponentTurn } from './finishEndTime/switchToOpponentTurn';
import { cleanGameStates } from './finishEndTime/cleanGameStates';
import { GameUserEntity } from '../../../entities/game-user.entity';

export type FinishEndTimeActionPayload = {
  gameUser: GameUserEntity;
  opponentGameUser: GameUserEntity;
};

export async function handleFinishEndTimeAction(
  manager: EntityManager,
  payload: FinishEndTimeActionPayload,
  gameModel: GameModel,
) {
  switchToOpponentTurn(gameModel, payload.opponentGameUser);
  cleanGameStates(gameModel, payload.gameUser);

  await manager.save(gameModel);
}
