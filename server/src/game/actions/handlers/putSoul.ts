import { GameStateEntity } from '../../../entities/game.state.entity';
import { Zone, StateType, Game } from 'src/graphql';
import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';

const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const soulGameCards = gameEntity.gameCards
    .filter(gameCard => gameCard.zone === Zone.SOUL && gameCard.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards.length > 0 ? soulGameCards[0].position + 1 : 0;
};

const findPutSoulCountGameState = (gameEntity: GameEntity, gameUserId: number): GameStateEntity | undefined => {
  return gameEntity.gameStates.find(
    gameState => gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId,
  );
};

const initPutSoulCountGameState = (gameEntity: GameEntity, gameUserId: number): GameStateEntity => {
  return {
    ...new GameStateEntity(),
    game: gameEntity,
    state: { type: StateType.PUT_SOUL_COUNT, data: { value: 1, gameUserId } },
  };
};

const putSoulGameCard = (gameEntity: GameEntity, userId: string, gameCardId: number): GameEntity => {
  const gameCards = gameEntity.gameCards.map(gameCard =>
    gameCard.id === gameCardId
      ? {
          ...gameCard,
          position: calcNewSoulGameCardPosition(gameEntity, userId),
          zone: Zone.SOUL,
        }
      : { ...gameCard },
  );

  return { ...gameEntity, gameCards };
};

const savePutCountGameState = (gameEntity: GameEntity, gameUserId: number): GameEntity => {
  const putSoulCountGameState = findPutSoulCountGameState(gameEntity, gameUserId);

  if (putSoulCountGameState === undefined) {
    return {
      ...gameEntity,
      gameStates: [...gameEntity.gameStates, initPutSoulCountGameState(gameEntity, gameUserId)],
    };
  }

  const gameStates = gameEntity.gameStates.map(gameState =>
    gameState.id === putSoulCountGameState.id && gameState.state.type === StateType.PUT_SOUL_COUNT
      ? {
          ...gameState,
          state: {
            ...gameState.state,
            data: {
              ...gameState.state.data,
              value: gameState.state.data.value + 1,
            },
          },
        }
      : { ...gameState },
  );

  return {
    ...gameEntity,
    gameStates,
  };
};

export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId)!;
  const originalPosition = gameCard.position;
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId)!;

  gameEntity = putSoulGameCard(gameEntity, userId, data.payload.gameCardId!);
  gameEntity = savePutCountGameState(gameEntity, gameUser.id);
  await manager.save(GameEntity, gameEntity);

  const gameCardRepository = manager.withRepository(GameCardRepository);
  await gameCardRepository.packHandPositions(gameEntity.id, userId, originalPosition);
}
