import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game-state.entity';
import { GameCardEntity } from 'src/entities/game-card.entity';
import { StateType, Zone } from 'src/graphql';

const initEffectUseCountGameState = (gameEntity: GameEntity, gameCard: GameCardEntity): GameStateEntity => {
  return new GameStateEntity({
    game: gameEntity,
    gameCard: gameCard,
    state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } },
  });
};

export const saveEffectUseCountGameState = (gameEntity: GameEntity, gameCardId: number): GameEntity => {
  const gameCard = gameEntity.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (!gameCard) {
    throw new Error();
  }

  const existsState =
    gameEntity.gameStates.findIndex(
      gameState =>
        gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCard?.id === gameCard.id,
    ) >= 0;

  if (existsState) {
    gameEntity.gameStates = gameEntity.gameStates.map(gameState =>
      gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCard?.id === gameCard.id
        ? new GameStateEntity({
            ...gameState,
            state: {
              type: StateType.EFFECT_RUTERUTE_DRAW_COUNT,
              data: { value: gameState.state.data.value + 1 },
            },
          })
        : gameState,
    );

    return gameEntity;
  }

  gameEntity.gameStates.push(initEffectUseCountGameState(gameEntity, gameCard));
  return gameEntity;
};
