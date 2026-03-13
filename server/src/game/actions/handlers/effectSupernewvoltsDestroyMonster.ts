import { v4 as uuidv4 } from 'uuid';
import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType, StateType } from 'src/graphql/index';
import { incrementGameCardCountStateValue } from 'src/game/mutations/incrementGameCardCountStateValue';
import { moveDeckTopCardToMorgue } from '../../mutations/moveDeckTopCardToMorgue';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

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
  gameModel = incrementGameCardCountStateValue(
    gameModel,
    payload.gameCard,
    StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT,
  );
  gameModel = addGameLog(
    gameModel,
    `${getDisplayName(gameModel, userId)}がデッキトップをコストとして${
      payload.gameCard.card.name
    }の効果を発動しました。`,
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
        effect: { type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER, targetGameCardId: payload.targetGameCard.id },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
