import { GameEntity } from '../../../../entities/game.entity';
import { GameStateEntity } from '../../../../entities/game-state.entity';
import { Zone, StateType } from '../../../../graphql';

export const incrementAttackCount = (gameEntity: GameEntity, gameCardId: number): GameEntity => {
  const gameCard = gameEntity.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (gameCard === undefined) {
    throw new Error('Game card not found');
  }

  if (gameCard.zone !== Zone.BATTLE) {
    return gameEntity;
  }

  const existingAttackCountStateIndex = gameEntity.gameStates.findIndex(
    state => state.state.type === StateType.ATTACK_COUNT && state.gameCard.id === gameCardId,
  );

  if (existingAttackCountStateIndex >= 0) {
    gameEntity.gameStates = gameEntity.gameStates.map(gameState =>
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
      game: gameEntity,
      gameCard,
      state: { type: StateType.ATTACK_COUNT, data: { value: 1 } },
    });

    gameEntity.gameStates.push(newGameState);
  }

  return gameEntity;
};
