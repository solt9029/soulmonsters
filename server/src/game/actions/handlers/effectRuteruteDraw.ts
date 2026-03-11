import { v4 as uuidv4 } from 'uuid';
import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { GameChainModel, GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { subtractUserEnergy } from 'src/game/mutations/subtractUserEnergy';
import { incrementGameCardCountStateValue } from 'src/game/mutations/incrementGameCardCountStateValue';
import { EffectType, StateType } from 'src/graphql';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { getDisplayName } from 'src/game/selectors/getDisplayName';

export type EffectRuteruteDrawActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectRuteruteDraw(
  userId: string,
  payload: EffectRuteruteDrawActionPayload,
  gameModel: GameModel,
): GameModel {
  gameModel = subtractUserEnergy(gameModel, userId, 1);
  gameModel = incrementGameCardCountStateValue(gameModel, payload.gameCard, StateType.EFFECT_RUTERUTE_DRAW_COUNT);
  gameModel = addGameLog(
    gameModel,
    `${getDisplayName(gameModel, userId)}がエナジー1をコストとして${payload.gameCard.card.name}の効果を発動しました。`,
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
        effect: { type: EffectType.RUTERUTE_DRAW },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
