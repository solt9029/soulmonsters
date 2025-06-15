import { GameStateEntity } from './../../entities/game.state.entity';
import { Zone, StateType } from 'src/graphql';
import { GameCardRepository } from '../../repositories/game.card.repository';
import { GameEntity } from '../../entities/game.entity';
import { GameActionDispatchInput } from '../../graphql/index';
import { EntityManager } from 'typeorm';

export async function handlePutSoulAction(
  manager: EntityManager,
  userId: string,
  data: GameActionDispatchInput,
  gameEntity: GameEntity,
) {
  const yourSoulGameCards = gameEntity.gameCards
    .filter(value => value.zone === Zone.SOUL && value.currentUserId === userId)
    .sort((a, b) => b.position - a.position);
  const yourSoulGameCardMaxPosition =
    yourSoulGameCards.length > 0 ? yourSoulGameCards[0].position : -1;
  const gameCardRepository = manager.getCustomRepository(GameCardRepository);
  const gameCard = await gameCardRepository.findOne({
    id: data.payload.gameCardId,
  });
  await gameCardRepository.update(
    { id: data.payload.gameCardId },
    { position: yourSoulGameCardMaxPosition + 1, zone: Zone.SOUL },
  );
  await gameCardRepository.query(
    `UPDATE gameCards SET position = position - 1 WHERE gameId = ${gameEntity.id} AND zone = "HAND" AND currentUserId = "${userId}" AND position > ${gameCard.position} ORDER BY position`,
  );

  // plus PUT_SOUL_COUNT
  const yourGameUser = gameEntity.gameUsers.find(
    value => value.userId === userId,
  );
  const gameStates = await manager.find(GameStateEntity, {
    game: gameEntity,
    gameCard: null,
  });
  let putSoulCountGameState = gameStates.find(
    gameState =>
      gameState.state.type === StateType.PUT_SOUL_COUNT &&
      gameState.state.data.gameUserId === yourGameUser.id,
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
  manager.save(GameStateEntity, putSoulCountGameState);
}
