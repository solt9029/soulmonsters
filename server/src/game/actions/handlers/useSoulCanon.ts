import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { moveCostGameCardsToMorgue } from './useSoulCanon/moveCostGameCardsToMorgue';
import { moveTargetGameCardToMorgue } from './useSoulCanon/moveTargetGameCardToMorgue';

export interface UseSoulCanonActionPayload {
  costGameCards: GameCardModel[];
  targetGameCard: GameCardModel;
}

export function handleUseSoulCanonAction(
  userId: string,
  payload: UseSoulCanonActionPayload,
  gameModel: GameModel,
): GameModel {
  const { costGameCards, targetGameCard } = payload;

  gameModel = moveCostGameCardsToMorgue(gameModel, userId, costGameCards);
  gameModel = moveTargetGameCardToMorgue(gameModel, targetGameCard);

  return gameModel;
}
