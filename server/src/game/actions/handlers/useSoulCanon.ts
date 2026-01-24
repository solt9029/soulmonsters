import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { moveGameCardsToMorgue } from 'src/game/mutations/moveGameCardsToMorgue';
import { EffectType } from 'src/graphql/index';

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

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING,
    gameChainLinks: [
      new GameChainLinkModel({
        orderIndex: 0,
        userId,
        gameCardId: null,
        status: GameChainLinkStatus.WAITING,
        effect: { type: EffectType.SOUL_CANON, targetGameCardId: targetGameCard.id },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
