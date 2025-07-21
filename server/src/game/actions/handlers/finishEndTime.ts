import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { cleanGameStates } from './finishEndTime/cleanGameStates';
import { switchToOpponentTurn } from './finishEndTime/switchToOpponentTurn';

export async function handleFinishEndTimeAction(
  manager: EntityManager,
  userId: string,
  _id: number,
  gameEntity: GameEntity,
) {
  switchToOpponentTurn(gameEntity, userId);
  cleanGameStates(gameEntity, userId);

  await manager.save(GameEntity, gameEntity);
}
