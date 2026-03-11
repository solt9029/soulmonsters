import { v4 as uuidv4 } from 'uuid';
import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { subtractUserEnergy } from 'src/game/mutations/subtractUserEnergy';
import { EffectType } from 'src/graphql/index';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

export type EffectNatsukashinorudePowerDownActionPayload = {
  gameCard: GameCardModel;
  targetGameCard: GameCardModel;
};

export function handleEffectNatsukashinorudePowerDown(
  userId: string,
  payload: EffectNatsukashinorudePowerDownActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = subtractUserEnergy(gameModel, userId, 2);
  gameModel = addGameLog(
    gameModel,
    `${getDisplayName(gameModel, userId)}がエナジー2をコストとして${payload.gameCard.card.name}の効果を発動しました。`,
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
        effect: { type: EffectType.NATSUKASHINORUDE_POWER_DOWN, targetGameCardId: payload.targetGameCard.id },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
