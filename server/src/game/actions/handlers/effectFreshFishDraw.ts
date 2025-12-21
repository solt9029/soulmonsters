import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { drawCardFromDeck } from './effectRuteruteDraw/drawCardFromDeck';
import { saveEffectUseCountGameState } from './effectFreshFishDraw/saveEffectUseCountGameState';
import { subtractUserEnergy } from '../../utils/subtractUserEnergy';

export type EffectFreshFishDrawActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectFreshFishDraw(
  userId: string,
  payload: EffectFreshFishDrawActionPayload,
  gameModel: GameModel,
): GameModel {
  subtractUserEnergy(gameModel, userId, 3);
  drawCardFromDeck(gameModel, userId);
  drawCardFromDeck(gameModel, userId);
  saveEffectUseCountGameState(gameModel, payload.gameCard);
  return gameModel;
}
