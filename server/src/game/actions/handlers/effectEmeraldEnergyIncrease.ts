import { v4 as uuidv4 } from 'uuid';
import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { GameChainModel, GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { incrementGameCardCountStateValue } from 'src/game/mutations/incrementGameCardCountStateValue';
import { EffectType, StateType } from 'src/graphql';

export type EffectEmeraldEnergyIncreaseActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectEmeraldEnergyIncrease(
  userId: string,
  payload: EffectEmeraldEnergyIncreaseActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = incrementGameCardCountStateValue(
    gameModel,
    payload.gameCard,
    StateType.EFFECT_EMERALD_ENERGY_INCREASE_COUNT,
  );

  const gameChainId = uuidv4();
  const gameChain = new GameChainModel({
    id: gameChainId,
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING, // TODO: WAITINGにしたい。今はGameChainLinkConfirmationの概念がないためRESOLVINGにしている
    gameChainLinks: [
      new GameChainLinkModel({
        id: uuidv4(),
        gameChainId,
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
