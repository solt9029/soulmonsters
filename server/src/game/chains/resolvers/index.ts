import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { resolveRuteruteDraw } from './ruteruteDraw';
import { getResolvingGameChain } from 'src/game/selectors/getResolvingGameChain';
import { markGameChainAsResolved } from 'src/game/utils/markGameChainAsResolved';
import { markGameChainLinkAsResolving } from 'src/game/utils/markGameChainLinkAsResolving';
import { getGameChainLink } from 'src/game/selectors/getGameChainLink';

export class ChainResolver {
  resolveChain(gameModel: GameModel): GameModel {
    const resolvingGameChain = getResolvingGameChain(gameModel);
    if (resolvingGameChain === undefined) {
      return gameModel;
    }

    const sortedLinks = [...resolvingGameChain.gameChainLinks].sort((a, b) => b.orderIndex - a.orderIndex);

    for (const link of sortedLinks) {
      if (link.status === GameChainLinkStatus.RESOLVED) {
        continue;
      }

      if (link.status === GameChainLinkStatus.WAITING) {
        gameModel = markGameChainLinkAsResolving(gameModel, resolvingGameChain, link);
      }

      gameModel = this.resolveChainLink(gameModel, link);

      const updatedLink = getGameChainLink(gameModel, link.id);

      if (updatedLink?.status !== GameChainLinkStatus.RESOLVED) {
        return gameModel;
      }
    }

    gameModel = markGameChainAsResolved(gameModel, resolvingGameChain.id);

    return gameModel;
  }

  private resolveChainLink(gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel {
    switch (gameChainLink.effect.type) {
      case EffectType.RUTERUTE_DRAW: {
        return resolveRuteruteDraw(gameModel, gameChainLink);
      }
      default:
        throw new Error(`Unsupported effectType: ${gameChainLink.effect.type}`);
    }
  }
}
