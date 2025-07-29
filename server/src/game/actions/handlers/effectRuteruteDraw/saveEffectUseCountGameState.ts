import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game.state.entity';
import { GameCardEntity } from 'src/entities/game.card.entity';
import { StateType, Zone } from 'src/graphql';

const initEffectUseCountGameState = (gameEntity: GameEntity, gameCard: GameCardEntity): GameStateEntity => {
  return new GameStateEntity({
    game: gameEntity,
    gameCard: gameCard,
    state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } },
  });
};

export const saveEffectUseCountGameState = (gameEntity: GameEntity, gameUserId: number): GameEntity => {
  const ruteruteCard = gameEntity.gameCards.find(
    gameCard =>
      gameCard.currentUserId === gameEntity.gameUsers.find(u => u.id === gameUserId)?.userId &&
      gameCard.zone === Zone.BATTLE &&
      gameCard.card?.id === 1,
  );

  if (!ruteruteCard) {
    return gameEntity;
  }

  const index = gameEntity.gameStates.findIndex(
    gameState =>
      gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCard?.id === ruteruteCard.id,
  );

  if (index >= 0) {
    gameEntity.gameStates = gameEntity.gameStates.map(gameState =>
      gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCard?.id === ruteruteCard.id
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

  gameEntity.gameStates.push(initEffectUseCountGameState(gameEntity, ruteruteCard));
  return gameEntity;
};
