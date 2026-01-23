import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { GameStateModel } from 'src/models/game-state.model';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { EffectType, StateType } from 'src/graphql/index';

export const resolveNatsukashinorudePowerDown = (
  gameModel: GameModel,
  gameChainLink: GameChainLinkModel,
): GameModel => {
  if (gameChainLink.effect.type !== EffectType.NATSUKASHINORUDE_POWER_DOWN) {
    return gameModel;
  }

  if (!gameChainLink.gameCardId) {
    return gameModel;
  }

  const newGameState = new GameStateModel({
    gameCardId: gameChainLink.gameCardId,
    state: {
      type: StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN,
      data: {
        targetGameCardId: gameChainLink.effect.targetGameCardId,
        value: 700,
      },
    },
  });

  gameModel.gameStates = [...gameModel.gameStates, newGameState];
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  return gameModel;
};
