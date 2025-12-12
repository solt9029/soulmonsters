import { GameModel } from '../../../models/game.model';
import { EntityManager } from 'typeorm';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectRuteruteDraw/saveEffectUseCountGameState';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
import { EffectRuteruteDrawActionPayload } from '../validators/effectRuteruteDraw';

export async function handleEffectRuteruteDraw(
  manager: EntityManager,
  userId: string,
  payload: EffectRuteruteDrawActionPayload,
  gameModel: GameModel,
) {
  subtractUserEnergy(gameModel, userId, 1);
  drawCardFromDeck(gameModel, userId);
  saveEffectUseCountGameState(gameModel, payload.gameCardId);

  await manager.save(gameModel.toEntity());
}
