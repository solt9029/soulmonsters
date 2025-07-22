import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { switchToOpponentTurn } from './finishEndTime/switchToOpponentTurn';
import { cleanGameStates } from './finishEndTime/cleanGameStates';

export async function handleFinishEndTimeAction(manager: EntityManager, userId: string, gameEntity: GameEntity) {
  switchToOpponentTurn(gameEntity, userId);
  cleanGameStates(gameEntity, userId);

  await manager.save(GameEntity, gameEntity);
}
