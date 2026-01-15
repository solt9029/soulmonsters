import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { resolveRuteruteDraw } from './ruteruteDraw';

export class ChainResolver {
  resolveChain(gameModel: GameModel): GameModel {
    const resolvingGameChains = gameModel.gameChains.filter(c => c.status === GameChainStatus.RESOLVING);

    if (resolvingGameChains.length > 1) {
      throw new Error('Multiple resolving gameChains found');
    }

    const resolvingGameChain = resolvingGameChains[0];

    if (resolvingGameChain === undefined) {
      return gameModel;
    }

    // TODO:
    // - gameChainLinksをorderIndexの降順にした上で、ループで、各gameChainLinkをRESOLVINGに変更しつつ処理実行する
    // - 今後出てくるgameChainLinkのeffectによっては、ユーザーのアクションが必要になりループ途中で止まる想定

    const resolvingGameChainLinks = resolvingGameChain.gameChainLinks.filter(
      cl => cl.status === GameChainLinkStatus.RESOLVING,
    );

    if (resolvingGameChainLinks.length > 1) {
      throw new Error('Multiple resolving gameChainLinks found');
    }

    const resolvingGameChainLink = resolvingGameChainLinks[0];

    if (resolvingGameChainLink === undefined) {
      resolvingGameChain.status = GameChainStatus.RESOLVED;
      return gameModel;
    }

    gameModel = this.resolveChainLink(gameModel, resolvingGameChain, resolvingGameChainLink);

    return gameModel;
  }

  private resolveChainLink(
    gameModel: GameModel,
    gameChain: GameChainModel,
    gameChainLink: GameChainLinkModel,
  ): GameModel {
    switch (gameChainLink.effect.type) {
      case EffectType.RUTERUTE_DRAW: {
        gameModel = resolveRuteruteDraw(gameModel, gameChainLink);
        break;
      }

      default:
        throw new Error(`Unsupported effectType: ${gameChainLink.effect.type}`);
    }

    const updatedGameChainLink = new GameChainLinkModel({
      ...gameChainLink,
      status: GameChainLinkStatus.RESOLVED,
    });

    const updatedGameChainLinks = gameChain.gameChainLinks.map(link =>
      link.id === gameChainLink.id ? updatedGameChainLink : link,
    );

    const allLinksResolved = updatedGameChainLinks.every(link => link.status === GameChainLinkStatus.RESOLVED);

    const updatedGameChain = new GameChainModel({
      ...gameChain,
      gameChainLinks: updatedGameChainLinks,
      status: allLinksResolved ? GameChainStatus.RESOLVED : gameChain.status,
    });

    gameModel.gameChains = gameModel.gameChains.map(chain => (chain.id === gameChain.id ? updatedGameChain : chain));

    return gameModel;
  }
}
