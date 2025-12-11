import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { drawCardFromDeck } from './startDrawTime/drawCardFromDeck';
import { updateGamePhaseAndTurn } from './startDrawTime/updateGamePhaseAndTurn';

export async function handleStartDrawTimeAction(manager: EntityManager, userId: string, gameModel: GameModel) {
  updateGamePhaseAndTurn(gameModel);
  drawCardFromDeck(gameModel, userId);

  await manager.save(gameModel);
}
