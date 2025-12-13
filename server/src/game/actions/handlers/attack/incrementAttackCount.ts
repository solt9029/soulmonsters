import { GameModel } from '../../../../models/game.model';
import { GameStateModel } from '../../../../models/game-state.model';
import { Zone, StateType } from '../../../../graphql';

export const incrementAttackCount = (gameModel: GameModel, gameCardId: number): GameModel => {
  const gameCard = gameModel.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (gameCard === undefined) {
    throw new Error('Game card not found');
  }

  if (gameCard.zone !== Zone.BATTLE) {
    return gameModel;
  }

  const existingAttackCountStateIndex = gameModel.gameStates.findIndex(
    state => state.state.type === StateType.ATTACK_COUNT && state.gameCardId === gameCardId,
  );

  if (existingAttackCountStateIndex >= 0) {
    gameModel.gameStates = gameModel.gameStates.map(gameState =>
      gameState.state.type === StateType.ATTACK_COUNT && gameState.gameCardId === gameCardId
        ? new GameStateModel({
            ...gameState,
            state: {
              type: StateType.ATTACK_COUNT,
              data: { value: gameState.state.data['value'] + 1 },
            },
          })
        : gameState,
    );
  } else {
    const newGameState = new GameStateModel({
      gameCardId: gameCard.id,
      state: { type: StateType.ATTACK_COUNT, data: { value: 1 } },
    });

    gameModel.gameStates.push(newGameState);
  }

  return gameModel;
};
