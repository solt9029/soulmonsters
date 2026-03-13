import { v4 as uuidv4 } from 'uuid';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { moveGameCardsToMorgue } from 'src/game/mutations/moveGameCardsToMorgue';
import { EffectType } from 'src/graphql/index';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';
import { CARD_NAME } from 'src/constants/card';

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
  gameModel = addGameLog(
    gameModel,
    `${getDisplayName(gameModel, userId)}がソウル3をコストとして${CARD_NAME.HEDORON}の効果を発動しました。`,
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
        gameCardId: null,
        status: GameChainLinkStatus.WAITING,
        effect: { type: EffectType.HEDRON_SPECIAL_SUMMON },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
