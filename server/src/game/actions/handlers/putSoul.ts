import { GameStateEntity } from '../../../entities/game.state.entity';
import { Zone, StateType } from 'src/graphql';
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
  const gameCard = gameEntity.gameCards.find(value => value.id === data.payload.gameCardId);

  if (!gameCard) {
    throw new Error('Game card not found');
  }

  if (data.payload.gameCardId == null) {
    throw new Error('Game card ID is null');
  }

  // エンティティ操作（メモリ上での変更）
  // カードをSOULゾーンに移動
  const originalPosition = gameCard.position;
  for (let i = 0; i < gameEntity.gameCards.length; i++) {
    if (gameEntity.gameCards[i].id === gameCard.id) {
      gameEntity.gameCards[i].zone = Zone.SOUL;
      gameEntity.gameCards[i].position = calcNewSoulGameCardPosition(gameEntity, userId);
    }
  }

  // 手札位置の再配置をメモリ上で実行
  // packHandPositionsInMemory(gameEntity, userId, originalPosition);
  for (let i = 0; i < gameEntity.gameCards.length; i++) {
    const card = gameEntity.gameCards[i];
    if (card.zone === Zone.HAND && card.currentUserId === userId && card.position > originalPosition) {
      card.position -= 1;
    }
  }

  // PUT_SOUL_COUNTの更新
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!gameUser) {
    throw new Error('Game user not found');
  }

  let putSoulCountGameState = findPutSoulCountGameState(gameEntity, gameUser.id);

  if (putSoulCountGameState === undefined) {
    putSoulCountGameState = initPutSoulCountGameState(gameEntity, gameUser.id);
    gameEntity.gameStates.push(putSoulCountGameState);
  } else {
    if (putSoulCountGameState.state.type === StateType.PUT_SOUL_COUNT) {
      putSoulCountGameState.state.data.value++;
    }
  }

  // 一括保存
  await manager.save(GameEntity, gameEntity);
}
