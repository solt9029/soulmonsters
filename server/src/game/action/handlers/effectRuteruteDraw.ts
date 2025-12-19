import { GameModel } from '../../../models/game.model';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectRuteruteDraw/saveEffectUseCountGameState';
import { subtractUserEnergy } from './utils/subtractUserEnergy';
import { EffectRuteruteDrawActionPayload } from '../validators/effectRuteruteDraw';

export function handleEffectRuteruteDraw(
  userId: string,
  payload: EffectRuteruteDrawActionPayload,
  gameModel: GameModel,
): GameModel {
  subtractUserEnergy(gameModel, userId, 1);
  drawCardFromDeck(gameModel, userId);
  saveEffectUseCountGameState(gameModel, payload.gameCard);
  return gameModel;
}
