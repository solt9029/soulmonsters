import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { saveEffectUseCountGameState } from './effectSupernewvoltsDestroyMonster/saveEffectUseCountGameState';
import { moveDeckTopCardToMorgue } from './effectSupernewvoltsDestroyMonster/moveDeckTopCardToMorgue';

export type EffectSupernewvoltsDestroyMonsterActionPayload = {
  gameCard: GameCardModel;
  targetGameCard: GameCardModel;
};

export function handleEffectSupernewvoltsDestroyMonster(
  userId: string,
  payload: EffectSupernewvoltsDestroyMonsterActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = moveDeckTopCardToMorgue(gameModel, userId);
  gameModel = saveEffectUseCountGameState(gameModel, payload.gameCard);

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING, // TODO: WAITINGにしたい。今はGameChainLinkConfirmationの概念がないためRESOLVINGにしている
    gameChainLinks: [
      new GameChainLinkModel({
        orderIndex: 0,
        userId,
        gameCardId: payload.gameCard.id,
        status: GameChainLinkStatus.WAITING,
        effect: { type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER, targetGameCardId: payload.targetGameCard.id },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
