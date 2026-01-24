import { GameModel } from 'src/models/game.model';
import { GameStateModel } from 'src/models/game-state.model';
import { StateType } from 'src/graphql';

export const incrementUserCountStateValue = (
  gameModel: GameModel,
  gameUserId: number,
  stateType: StateType.PUT_SOUL_COUNT,
): GameModel => {
  const existsState =
    gameModel.gameStates.findIndex(
      gameState => gameState.state.type === stateType && gameState.state.data.gameUserId === gameUserId,
    ) >= 0;

  if (existsState) {
    gameModel.gameStates = gameModel.gameStates.map(gameState =>
      gameState.state.type === stateType && gameState.state.data.gameUserId === gameUserId
        ? new GameStateModel({
            ...gameState,
            state: {
              type: stateType,
              data: { gameUserId, value: gameState.state.data.value + 1 },
            },
          })
        : gameState,
    );

    return gameModel;
  }

  gameModel.gameStates.push(
    new GameStateModel({
      state: { type: stateType, data: { value: 1, gameUserId } },
    }),
  );
  return gameModel;
};
