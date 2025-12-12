import { GameModel } from 'src/models/game.model';
import { GameStateModel } from 'src/models/game-state.model';
import { GameCardEntity } from 'src/entities/game-card.entity';
import { StateType } from 'src/graphql';

const initEffectUseCountGameState = (gameModel: GameModel, gameCard: GameCardEntity): GameStateModel => {
  return new GameStateModel({
    game: gameModel.toEntity(),
    gameCard: gameCard,
    state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } },
  });
};

export const saveEffectUseCountGameState = (gameModel: GameModel, gameCard: GameCardEntity): GameModel => {
  const existsState =
    gameModel.gameStates.findIndex(
      gameState =>
        gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCard?.id === gameCard.id,
    ) >= 0;

  if (existsState) {
    gameModel.gameStates = gameModel.gameStates.map(gameState =>
      gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCard?.id === gameCard.id
        ? new GameStateModel({
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
