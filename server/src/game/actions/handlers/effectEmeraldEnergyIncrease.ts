import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { GameChainModel, GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { incrementEffectUseCount } from 'src/game/mutations/incrementEffectUseCount';
import { EffectType, StateType } from 'src/graphql';

export type EffectEmeraldEnergyIncreaseActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectEmeraldEnergyIncrease(
  userId: string,
  payload: EffectEmeraldEnergyIncreaseActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = incrementEffectUseCount(gameModel, payload.gameCard, StateType.EFFECT_EMERALD_ENERGY_INCREASE_COUNT);

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING, // TODO: WAITINGにしたい。今はGameChainLinkConfirmationの概念がないためRESOLVINGにしている
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
