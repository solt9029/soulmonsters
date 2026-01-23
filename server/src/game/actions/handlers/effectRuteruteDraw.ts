import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from '../../../models/game.model';
import { GameChainModel, GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { subtractUserEnergy } from '../../mutations/subtractUserEnergy';
import { EffectType } from '../../../graphql/index';

export type EffectRuteruteDrawActionPayload = {
  gameCard: GameCardModel;
};

export function handleEffectRuteruteDraw(
  userId: string,
  payload: EffectRuteruteDrawActionPayload,
  gameModel: GameModel,
): GameModel {
  subtractUserEnergy(gameModel, userId, 1);

  const gameChain = new GameChainModel({
    gameId: gameModel.id,
    status: GameChainStatus.RESOLVING,
    gameChainLinks: [
      new GameChainLinkModel({
        orderIndex: 0,
        userId,
        gameCardId: payload.gameCard.id,
        status: GameChainLinkStatus.RESOLVING,
        effect: { type: EffectType.RUTERUTE_DRAW },
      }),
    ],
  });

  gameModel.gameChains = [...gameModel.gameChains, gameChain];

  return gameModel;
}
