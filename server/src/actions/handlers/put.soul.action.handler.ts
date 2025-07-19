import { GameStateEntity } from './../../entities/game.state.entity';
import { Zone, StateType } from 'src/graphql';
import { GameCardRepository } from '../../repositories/game.card.repository';
import { GameEntity } from '../../entities/game.entity';
import { GameActionDispatchInput } from '../../graphql/index';
import { EntityManager } from 'typeorm';

const calcNewSoulGameCardPosition = (gameEntity: GameEntity, userId: string): number => {
  const soulGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.SOUL && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);

  return soulGameCards.length > 0 ? soulGameCards[0].position + 1 : 0;
};

export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);

  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId);

  await gameCardRepository.update(
    { id: data.payload.gameCardId },
    { position: calcNewSoulGameCardPosition(gameEntity, userId), zone: Zone.SOUL },
  );

  await gameCardRepository.packHandPositions(gameEntity.id, userId, gameCard.position);

  // plus PUT_SOUL_COUNT
  const yourGameUser = gameEntity.gameUsers.find(value => value.userId === userId);
  const gameStates = await manager.find(GameStateEntity, {
    where: {
      game: gameEntity,
      gameCard: null,
    },
  });

  let putSoulCountGameState = gameStates.find(
    gameState =>
      gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === yourGameUser.id,
  );

  if (putSoulCountGameState === undefined) {
    putSoulCountGameState = new GameStateEntity();
    putSoulCountGameState.state = {
      type: StateType.PUT_SOUL_COUNT,
      data: { value: 1, gameUserId: yourGameUser.id },
    };
    putSoulCountGameState.game = gameEntity;
  } else {
    putSoulCountGameState.state.data['value']++;
  }

  await manager.save(GameStateEntity, putSoulCountGameState);
}
