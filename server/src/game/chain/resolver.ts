import { GameModel } from '../../models/game.model';
import { GameChainLinkModel, GameChainLinkStatus } from '../../models/game-chain-link.model';
import { GameStateModel } from '../../models/game-state.model';
import { EffectType, StateType } from '../../graphql/index';
import { drawCardFromDeck } from '../actions/handlers/effectRuteruteDraw/drawCardFromDeck';
import { GameChainStatus } from 'src/models/game-chain.model';

export class ChainResolver {
  resolveChainIfNeeded(gameModel: GameModel): GameModel {
    const resolvingGameChain = gameModel.gameChains
      .filter(c => c.status === 'RESOLVING')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (!resolvingGameChain) {
      return gameModel;
    }

    const resolvingGameChainLink = resolvingGameChain.gameChainLinks
      .filter(cl => cl.status === GameChainLinkStatus.RESOLVING)
      .sort((a, b) => b.orderIndex - a.orderIndex)[0];

    if (!resolvingGameChainLink) {
      resolvingGameChain.status = GameChainStatus.RESOLVED;
      return gameModel;
    }

    gameModel = this.resolveGameChainLink(gameModel, resolvingGameChainLink);

    return gameModel;
  }

  private resolveGameChainLink(gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel {
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

    // memo: これでちゃんと更新されるかやや不安。gameModel経由で書き換えたい
    gameChainLink.status = GameChainLinkStatus.RESOLVED;

    return gameModel;
  }
}
