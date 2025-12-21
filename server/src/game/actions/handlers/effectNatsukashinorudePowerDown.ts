import { GameCardModel } from 'src/models/game-card.model';
import { GameModel } from 'src/models/game.model';
import { GameStateModel } from 'src/models/game-state.model';
import { StateType } from 'src/graphql';
import { subtractUserEnergy } from '../utils/subtractUserEnergy';

export type EffectNatsukashinorudePowerDownActionPayload = {
  gameCard: GameCardModel;
  targetGameCard: GameCardModel;
};

export function handleEffectNatsukashinorudePowerDown(
  userId: string,
  payload: EffectNatsukashinorudePowerDownActionPayload,
  gameModel: GameModel,
): GameModel {
  subtractUserEnergy(gameModel, userId, 2);

  const newGameState = new GameStateModel({
    gameCardId: payload.gameCard.id,
    state: {
      type: StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN,
      data: {
        targetGameCardId: payload.targetGameCard.id,
        value: 700,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  gameModel.gameStates = [...gameModel.gameStates, newGameState];

  const useCountGameState = new GameStateModel({
    gameCardId: payload.gameCard.id,
    state: {
      type: StateType.EFFECT_NATSUKASHINORUDE_USE_COUNT,
      data: { value: 1 },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  gameModel.gameStates = [...gameModel.gameStates, useCountGameState];

  return gameModel;
}
