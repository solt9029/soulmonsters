import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { moveGameCardsToMorgue } from 'src/game/mutations/moveGameCardsToMorgue';
import { moveTargetGameCardToMorgue } from '../../mutations/useSoulCanon/moveTargetGameCardToMorgue';

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

  gameModel = moveGameCardsToMorgue(gameModel, userId, costGameCards);
  gameModel = moveTargetGameCardToMorgue(gameModel, targetGameCard);

  return gameModel;
}
