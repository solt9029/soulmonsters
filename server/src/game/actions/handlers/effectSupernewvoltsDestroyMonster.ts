import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { GameChainModel, GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { EffectType } from '../../../graphql/index';

export type EffectSupernewvoltsDestroyMonsterActionPayload = {
  gameCard: GameCardModel;
  targetGameCard: GameCardModel;
};

export function handleEffectSupernewvoltsDestroyMonster(
  userId: string,
  payload: EffectSupernewvoltsDestroyMonsterActionPayload,
  gameModel: GameModel,
): GameModel {
  // No cost processing needed for this effect

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING, // TODO: WAITINGにしたい。今はGameChainLinkConfirmationの概念がないためRESOLVINGにしている
    gameChainLinks: [
      new GameChainLinkModel({
        orderIndex: 0,
        userId,
        gameCardId: payload.gameCard.id,
        status: GameChainLinkStatus.WAITING,
        effect: { 
          type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER,
          payload: payload
        },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
