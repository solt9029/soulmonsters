import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game.state.entity';
import { StateType } from 'src/graphql';

const initPutSoulCountGameState = (gameEntity: GameEntity, gameUserId: number): GameStateEntity => {
  return {
    ...new GameStateEntity(),
    game: gameEntity,
    state: { type: StateType.PUT_SOUL_COUNT, data: { value: 1, gameUserId } },
  };
};

export const savePutCountGameState = (gameEntity: GameEntity, gameUserId: number): GameEntity => {
  const targetGameStateId = gameEntity.gameStates.findIndex(
    gameState => gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId,
  );

  if (targetGameStateId === -1) {
    return {
      ...gameEntity,
      gameStates: [...gameEntity.gameStates, initPutSoulCountGameState(gameEntity, gameUserId)],
    };
  }

  const gameStates = gameEntity.gameStates.map(gameState => {
    if (gameState.id === targetGameStateId && gameState.state.type === StateType.PUT_SOUL_COUNT) {
      const data = { ...gameState.state.data, value: gameState.state.data.value + 1 };
      return { ...gameState, state: { ...gameState.state, data } };
    }

    return { ...gameState };
  });

  return { ...gameEntity, gameStates };
};
