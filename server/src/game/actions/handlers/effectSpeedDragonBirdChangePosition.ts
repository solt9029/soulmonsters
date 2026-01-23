import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';

import { moveCostGameCardsToMorgue } from 'src/game/mutations/moveCostGameCardsToMorgue';

export type EffectSpeedDragonBirdChangePositionActionPayload = {
  gameCard: GameCardModel;
  costGameCards: GameCardModel[];
  targetGameCard: GameCardModel;
};

export function handleEffectSpeedDragonBirdChangePosition(
  userId: string,
  payload: EffectSpeedDragonBirdChangePositionActionPayload,
  gameModel: GameModel,
): GameModel {
  const { costGameCards, gameCard, targetGameCard } = payload;

  gameModel = moveCostGameCardsToMorgue(gameModel, userId, costGameCards);

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING,
    gameChainLinks: [
      new GameChainLinkModel({
        orderIndex: 0,
        userId,
        gameCardId: gameCard.id,
        status: GameChainLinkStatus.WAITING,
        effect: {
          type: EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION,
          payload: { gameCard, costGameCards, targetGameCard },
        },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
