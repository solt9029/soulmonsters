import { v4 as uuidv4 } from 'uuid';
import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { EffectType } from 'src/graphql/index';
import { moveGameCardsToMorgue } from 'src/game/mutations/moveGameCardsToMorgue';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

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
  const { costGameCards, targetGameCard } = payload;

  gameModel = moveGameCardsToMorgue(gameModel, userId, costGameCards);
  gameModel = addGameLog(
    gameModel,
    `${getDisplayName(gameModel, userId)}がソウル3をコストとして${payload.gameCard.card.name}の効果を発動しました。`,
  );

  const gameChainId = uuidv4();
  const gameChain = new GameChainModel({
    id: gameChainId,
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING,
    gameChainLinks: [
      new GameChainLinkModel({
        id: uuidv4(),
        gameChainId,
        orderIndex: 0,
        userId,
        gameCardId: payload.gameCard.id,
        status: GameChainLinkStatus.WAITING,
        effect: { type: EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION, targetGameCardId: targetGameCard.id },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
