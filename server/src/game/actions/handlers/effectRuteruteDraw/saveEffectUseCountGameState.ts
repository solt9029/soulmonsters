import { GameModel } from 'src/models/game.model';
import { GameStateEntity } from 'src/entities/game-state.entity';
import { GameCardEntity } from 'src/entities/game-card.entity';
import { StateType, Zone } from 'src/graphql';

const initEffectUseCountGameState = (gameModel: GameModel, gameCard: GameCardEntity): GameStateEntity => {
  return new GameStateEntity({
    game: gameModel.toEntity(),
    gameCard: gameCard,
    state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } },
  });
};

export const saveEffectUseCountGameState = (gameModel: GameModel, gameCardId: number): GameModel => {
  const gameCard = gameModel.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (!gameCard) {
    throw new Error();
  }

  const existsState =
    gameModel.gameStates.findIndex(
      gameState =>
        gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCard?.id === gameCard.id,
    ) >= 0;

  if (existsState) {
    gameModel.gameStates = gameModel.gameStates.map(gameState =>
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

    return gameModel;
  }

  gameModel.gameStates.push(initEffectUseCountGameState(gameModel, gameCard));
  return gameModel;
};
