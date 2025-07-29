import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game.state.entity';
import { StateType } from 'src/graphql';

const initEffectUseCountGameState = (gameEntity: GameEntity, effectType: string, gameUserId: number): GameStateEntity => {
  return new GameStateEntity({
    game: gameEntity,
    state: { type: StateType.EFFECT_USE_COUNT, data: { effectType, gameUserId, value: 1 } },
  });
};

export const saveEffectUseCountGameState = (gameEntity: GameEntity, effectType: string, gameUserId: number): GameEntity => {
  const index = gameEntity.gameStates.findIndex(
    gameState => 
      gameState.state.type === StateType.EFFECT_USE_COUNT && 
      gameState.state.data.effectType === effectType &&
      gameState.state.data.gameUserId === gameUserId,
  );

  if (index >= 0) {
    gameEntity.gameStates = gameEntity.gameStates.map(gameState =>
      gameState.state.type === StateType.EFFECT_USE_COUNT && 
      gameState.state.data.effectType === effectType &&
      gameState.state.data.gameUserId === gameUserId
        ? new GameStateEntity({
            ...gameState,
            state: {
              type: StateType.EFFECT_USE_COUNT,
              data: { effectType, gameUserId, value: gameState.state.data.value + 1 },
            },
          })
        : gameState,
    );

    return gameEntity;
  }

  gameEntity.gameStates.push(initEffectUseCountGameState(gameEntity, effectType, gameUserId));
  return gameEntity;
};