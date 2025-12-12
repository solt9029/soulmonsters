import { GameModel } from '../../../../models/game.model';
import { GameStateEntity } from '../../../../entities/game-state.entity';
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
    state => state.state.type === StateType.ATTACK_COUNT && state.gameCard.id === gameCardId,
  );

  if (existingAttackCountStateIndex >= 0) {
    gameModel.gameStates = gameModel.gameStates.map(gameState =>
      gameState.state.type === StateType.ATTACK_COUNT && gameState.gameCard.id === gameCardId
        ? new GameStateEntity({
            ...gameState,
            state: {
              type: StateType.ATTACK_COUNT,
              data: { value: gameState.state.data['value'] + 1 },
            },
          })
        : gameState,
    );
  } else {
    const newGameState = new GameStateEntity({
      game: gameModel.toEntity(),
      gameCard,
      state: { type: StateType.ATTACK_COUNT, data: { value: 1 } },
    });

    gameModel.gameStates.push(newGameState);
  }

  return gameModel;
};
