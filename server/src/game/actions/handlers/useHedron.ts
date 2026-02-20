import { v4 as uuidv4 } from 'uuid';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { moveGameCardsToMorgue } from 'src/game/mutations/moveGameCardsToMorgue';
import { EffectType } from 'src/graphql/index';

export interface UseHedronActionPayload {
  costGameCards: GameCardModel[];
}

export function handleUseHedronAction(
  userId: string,
  payload: UseHedronActionPayload,
  gameModel: GameModel,
): GameModel {
  const { costGameCards } = payload;

  gameModel = moveGameCardsToMorgue(gameModel, userId, costGameCards);

  const gameChainId = uuidv4();
  const gameChain = new GameChainModel({
    id: gameChainId,
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING,
    gameChainLinks: [
      new GameChainLinkModel({
        id: uuidv4(),
        gameChainId,
        orderIndex: 0,
        userId,
        gameCardId: null,
        status: GameChainLinkStatus.WAITING,
        effect: { type: EffectType.HEDRON_SPECIAL_SUMMON },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
