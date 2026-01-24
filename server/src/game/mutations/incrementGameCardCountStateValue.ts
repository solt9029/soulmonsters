import { GameModel } from 'src/models/game.model';
import { GameStateModel } from 'src/models/game-state.model';
import { GameCardModel } from 'src/models/game-card.model';
import { StateType } from 'src/graphql';

export const incrementGameCardCountStateValue = (
  gameModel: GameModel,
  gameCard: GameCardModel,
  stateType:
    | StateType.EFFECT_FRESH_FISH_DRAW_COUNT
    | StateType.EFFECT_RUTERUTE_DRAW_COUNT
    | StateType.EFFECT_EMERALD_ENERGY_INCREASE_COUNT
    | StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT
    | StateType.ATTACK_COUNT,
): GameModel => {
  const existsState =
    gameModel.gameStates.findIndex(
      gameState => gameState.state.type === stateType && gameState.gameCardId === gameCard.id,
    ) >= 0;

  if (existsState) {
    gameModel.gameStates = gameModel.gameStates.map(gameState =>
      gameState.state.type === stateType && gameState.gameCardId === gameCard.id
        ? new GameStateModel({
            ...gameState,
            state: {
              type: stateType,
              data: { value: gameState.state.data.value + 1 },
            },
          })
        : gameState,
    );

    return gameModel;
  }

  gameModel.gameStates.push(
    new GameStateModel({
      gameCardId: gameCard.id,
      state: { type: stateType, data: { value: 1 } },
    }),
  );
  return gameModel;
};
