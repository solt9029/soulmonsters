import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectRuteruteDraw/saveEffectUseCountGameState';
import { subtractUserEnergy } from './utils/subtractUserEnergy';

export type EffectRuteruteDrawActionPayload = {
  gameCard: GameCardModel;
};

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
