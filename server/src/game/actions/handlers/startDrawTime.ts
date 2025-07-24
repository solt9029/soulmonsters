import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { drawCardFromDeck } from './startDrawTime/drawCardFromDeck';
import { updateGamePhaseAndTurn } from './startDrawTime/updateGamePhaseAndTurn';

export async function handleStartDrawTimeAction(manager: EntityManager, userId: string, gameEntity: GameEntity) {
  gameEntity = updateGamePhaseAndTurn(gameEntity);
  gameEntity = drawCardFromDeck(gameEntity, userId);

  await manager.save(GameEntity, gameEntity);
}
