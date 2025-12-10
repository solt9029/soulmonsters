import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game-state.entity';
import { StateType } from 'src/graphql';

const initPutSoulCountGameState = (gameEntity: GameEntity, gameUserId: number): GameStateEntity => {
  return new GameStateEntity({
    game: gameEntity,
    state: { type: StateType.PUT_SOUL_COUNT, data: { value: 1, gameUserId } },
  });
};

export const savePutCountGameState = (gameEntity: GameEntity, gameUserId: number): GameEntity => {
  const index = gameEntity.gameStates.findIndex(
    gameState => gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId,
  );

  if (index >= 0) {
    gameEntity.gameStates = gameEntity.gameStates.map(gameState =>
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

    return gameEntity;
  }

  gameEntity.gameStates.push(initPutSoulCountGameState(gameEntity, gameUserId));
  return gameEntity;
};
