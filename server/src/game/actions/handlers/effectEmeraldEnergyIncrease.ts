import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { GameChainModel, GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { saveEffectUseCountGameState } from '../../chains/resolvers/emeraldEnergyIncrease/saveEffectUseCountGameState';
import { EffectType } from '../../../graphql/index';

export type EffectEmeraldEnergyIncreaseActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectEmeraldEnergyIncrease(
  userId: string,
  payload: EffectEmeraldEnergyIncreaseActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = saveEffectUseCountGameState(gameModel, payload.gameCard);

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING,
    gameChainLinks: [
      new GameChainLinkModel({
        orderIndex: 0,
        userId,
        gameCardId: payload.gameCard.id,
        status: GameChainLinkStatus.WAITING,
        effect: { type: EffectType.EMERALD_ENERGY_INCREASE },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
