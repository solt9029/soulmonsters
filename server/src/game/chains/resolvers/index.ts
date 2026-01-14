import { GameModel } from '../../../models/game.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../../models/game-chain-link.model';
import { GameStateModel } from '../../../models/game-state.model';
import { EffectType, StateType } from '../../../graphql/index';
import { drawCardFromDeck } from '../../actions/handlers/effectRuteruteDraw/drawCardFromDeck';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';

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
        const gameCard = gameModel.gameCards.find(gc => gc.id === gameChainLink.gameCardId);
        if (!gameCard) {
          break;
        }

        drawCardFromDeck(gameModel, gameChainLink.userId);

        const existsState = gameModel.gameStates.find(
          gs => gs.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gs.gameCardId === gameCard.id,
        );

        if (existsState) {
          gameModel.gameStates = gameModel.gameStates.map(gs =>
            gs.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gs.gameCardId === gameCard.id
              ? new GameStateModel({
                  ...gs,
                  state: {
                    type: StateType.EFFECT_RUTERUTE_DRAW_COUNT,
                    data: { value: gs.state.data.value + 1 },
                  },
                })
              : gs,
          );
        } else {
          const newGameState = new GameStateModel({
            gameCardId: gameCard.id,
            state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } },
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          gameModel.gameStates = [...gameModel.gameStates, newGameState];
        }

        break;
      }

      default:
        throw new Error(`Unsupported effectType: ${gameChainLink.effect.type}`);
    }

    // TODO: これでちゃんと更新されるかやや不安。gameModel経由で書き換えたい
    gameChainLink.status = GameChainLinkStatus.RESOLVED;

    // TODO: gameChainLinkが全部RESOLVEDになってたらgameChainもRESOLVEDにする
    gameChain.status = GameChainStatus.RESOLVED;

    return gameModel;
  }
}
