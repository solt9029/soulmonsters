import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel } from 'src/models/game-chain-link.model';
import { GameStateModel } from 'src/models/game-state.model';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';
import { addGameLog } from 'src/game/mutations/addGameLog';
import { EffectType, StateType } from 'src/graphql/index';
import { CARD_NAME } from 'src/constants/card';

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

  const targetGameCardId = gameChainLink.effect.targetGameCardId;
  const targetGameCard = gameModel.gameCards.find(gc => gc.id === targetGameCardId);

  gameModel.gameStates = [...gameModel.gameStates, newGameState];
  gameModel = markGameChainLinkAsResolved(gameModel, gameChainLink);

  if (targetGameCard) {
    gameModel = addGameLog(
      gameModel,
      `${CARD_NAME.NATSUKASHINORUDE}の効果を処理し、${targetGameCard.card.name}の攻撃力を700下げました。`,
    );
  }

  return gameModel;
};
