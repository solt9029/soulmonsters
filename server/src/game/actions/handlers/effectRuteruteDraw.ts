import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { GameChainModel, GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { subtractUserEnergy } from 'src/game/mutations/subtractUserEnergy';
import { incrementEffectUseCount } from 'src/game/mutations/incrementEffectUseCount';
import { EffectType, StateType } from 'src/graphql';

export type EffectRuteruteDrawActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectRuteruteDraw(
  userId: string,
  payload: EffectRuteruteDrawActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = subtractUserEnergy(gameModel, userId, 1);
  gameModel = incrementEffectUseCount(gameModel, payload.gameCard, StateType.EFFECT_RUTERUTE_DRAW_COUNT);

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING, // TODO: WAITINGにしたい。今はGameChainLinkConfirmationの概念がないためRESOLVINGにしている
    gameChainLinks: [
      new GameChainLinkModel({
        orderIndex: 0,
        userId,
        gameCardId: payload.gameCard.id,
        status: GameChainLinkStatus.WAITING,
        effect: { type: EffectType.RUTERUTE_DRAW },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
