import { GameModel } from 'src/models/game.model';
import { GameStateEntity } from 'src/entities/game-state.entity';
import { StateType } from 'src/graphql';

const initPutSoulCountGameState = (gameModel: GameModel, gameUserId: number): GameStateEntity => {
  return new GameStateEntity({
    game: gameEntity,
    state: { type: StateType.PUT_SOUL_COUNT, data: { value: 1, gameUserId } },
  });
};

export const savePutCountGameState = (gameModel: GameModel, gameUserId: number): GameModel => {
  const index = gameModel.gameStates.findIndex(
    gameState => gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId,
  );

  if (index >= 0) {
    gameModel.gameStates = gameModel.gameStates.map(gameState =>
      gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId
        ? new GameStateEntity({
            ...gameState,
            state: {
              type: StateType.PUT_SOUL_COUNT,
              data: { gameUserId, value: gameState.state.data.value + 1 },
            },
          })
        : gameState,
    );

    return gameModel;
  }

  gameModel.gameStates.push(initPutSoulCountGameState(gameModel, gameUserId));
  return gameModel;
};
