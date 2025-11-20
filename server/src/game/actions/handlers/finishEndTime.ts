import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { switchToOpponentTurn } from './finishEndTime/switchToOpponentTurn';
import { cleanGameStates } from './finishEndTime/cleanGameStates';
import { GameUserEntity } from '../../../entities/game.user.entity';

export type FinishEndTimeActionPayload = {
  gameUser: GameUserEntity;
  opponentGameUser: GameUserEntity;
};

export async function handleFinishEndTimeAction(
  manager: EntityManager,
  payload: FinishEndTimeActionPayload,
  gameEntity: GameEntity,
) {
  switchToOpponentTurn(gameEntity, payload.opponentGameUser);
  cleanGameStates(gameEntity, payload.gameUser);

  await manager.save(GameEntity, gameEntity);
}
