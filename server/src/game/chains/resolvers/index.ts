import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { resolveRuteruteDraw } from './ruteruteDraw';
import { getResolvingGameChain } from 'src/game/utils/getResolvingGameChain';
import { getResolvingGameChainLink } from 'src/game/utils/getResolvingGameChainLink';

export class ChainResolver {
  resolveChain(gameModel: GameModel): GameModel {
    const resolvingGameChain = getResolvingGameChain(gameModel);
    if (resolvingGameChain === undefined) {
      return gameModel;
    }

    // TODO:
    // - gameChainLinksをorderIndexの降順にした上で、ループで、各gameChainLinkをRESOLVINGに変更しつつ処理実行する
    // - 今後出てくるgameChainLinkのeffectによっては、ユーザーのアクションが必要になりループ途中で止まる想定

    const resolvingGameChainLink = getResolvingGameChainLink(resolvingGameChain);
    if (resolvingGameChainLink === undefined) {
      resolvingGameChain.status = GameChainStatus.RESOLVED;
      return gameModel;
    }

    gameModel = this.resolveChainLink(gameModel, resolvingGameChain, resolvingGameChainLink);

    // TODO: 「gameChainLinksが全部RESOLVEDだったら」の条件を入れる
    // memo: 多分ここのchain.idは、DB保存前のものでnullとかになってるので、その点は注意する必要がある
    gameModel.gameChains = gameModel.gameChains.map(chain =>
      chain.id === resolvingGameChain.id ? new GameChainModel({ ...chain, status: GameChainStatus.RESOLVED }) : chain,
    );

    return gameModel;
  }

  private resolveChainLink(
    gameModel: GameModel,
    gameChain: GameChainModel,
    gameChainLink: GameChainLinkModel,
  ): GameModel {
    switch (gameChainLink.effect.type) {
      case EffectType.RUTERUTE_DRAW: {
        return resolveRuteruteDraw(gameModel, gameChain, gameChainLink);
      }
      default:
        throw new Error(`Unsupported effectType: ${gameChainLink.effect.type}`);
    }
  }
}
