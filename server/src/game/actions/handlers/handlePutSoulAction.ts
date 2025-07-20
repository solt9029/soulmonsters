import { GameStateEntity } from '../../../entities/game.state.entity';
import { Zone, StateType } from 'src/graphql';
import { GameCardRepository } from '../../../repositories/game.card.repository';
import { GameEntity } from '../../../entities/game.entity';
import { GameActionDispatchInput } from '../../../graphql/index';
import { EntityManager } from 'typeorm';

const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const soulGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.SOUL && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards.length > 0 ? soulGameCards[0].position + 1 : 0;
};

const findPutSoulCountGameState = (gameEntity: GameEntity, gameUserId: number): GameStateEntity | undefined => {
  return gameEntity.gameStates.find(
    gameState => gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId,
  );
};

const initPutSoulCountGameState = (gameEntity: GameEntity, gameUserId: number): GameStateEntity => {
  const gameStateEntity = new GameStateEntity();

  gameStateEntity.game = gameEntity;
  gameStateEntity.state = { type: StateType.PUT_SOUL_COUNT, data: { value: 1, gameUserId } };

  return gameStateEntity;
};

export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameCardRepository = manager.withRepository(GameCardRepository);

  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId);

  // プットゾーンにカードを置く
  await gameCardRepository.update(
    { id: data.payload.gameCardId },
    { position: calcNewSoulGameCardPosition(gameEntity, userId), zone: Zone.SOUL },
  );

  await gameCardRepository.packHandPositions(gameEntity.id, userId, gameCard.position);

  // plus PUT_SOUL_COUNT
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId);
  let putSoulCountGameState = findPutSoulCountGameState(gameEntity, gameUser.id);

  if (putSoulCountGameState === undefined) {
    putSoulCountGameState = initPutSoulCountGameState(gameEntity, gameUser.id);
  } else {
    putSoulCountGameState.state.data['value']++;
  }

  await manager.save(GameStateEntity, putSoulCountGameState);
}
