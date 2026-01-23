import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { GameChainModel, GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { subtractUserEnergy } from 'src/game/mutations/subtractUserEnergy';
import { incrementEffectUseCount } from 'src/game/mutations/incrementCountStateValue';
import { EffectType, StateType } from 'src/graphql';

export type EffectFreshFishDrawActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectFreshFishDraw(
  userId: string,
  payload: EffectFreshFishDrawActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = subtractUserEnergy(gameModel, userId, 3);
  gameModel = incrementEffectUseCount(gameModel, payload.gameCard, StateType.EFFECT_FRESH_FISH_DRAW_COUNT);

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING, // TODO: WAITINGにしたい。今はGameChainLinkConfirmationの概念がないためRESOLVINGにしている
    gameChainLinks: [
      new GameChainLinkModel({
        orderIndex: 0,
        userId,
        gameCardId: payload.gameCard.id,
        status: GameChainLinkStatus.WAITING,
        effect: { type: EffectType.FRESH_FISH_DRAW },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
