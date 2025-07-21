import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { StateType } from 'src/graphql';

const isAttackCountState = (gameState: any, userId: string): boolean => {
  return gameState.state.type === StateType.ATTACK_COUNT && gameState.gameCard.currentUserId === userId;
};

const isPutSoulCountState = (gameState: any, gameUserId: number): boolean => {
  return gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId;
};

const cleanGameStates = (gameEntity: GameEntity, userId: string): GameEntity => {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId)!;

  gameEntity.gameStates = gameEntity.gameStates.filter(
    gameState => !(isAttackCountState(gameState, userId) || isPutSoulCountState(gameState, gameUser.id)),
  );

  return gameEntity;
};

const switchToOpponentTurn = (gameEntity: GameEntity, userId: string): GameEntity => {
  const opponentGameUser = gameEntity.gameUsers.find(value => value.userId !== userId)!;

  gameEntity.phase = null;
  gameEntity.turnUserId = opponentGameUser.userId;

  return gameEntity;
};

export async function handleFinishEndTimeAction(
  manager: EntityManager,
  userId: string,
  _id: number,
  gameEntity: GameEntity,
) {
  switchToOpponentTurn(gameEntity, userId);
  cleanGameStates(gameEntity, userId);

  await manager.save(GameEntity, gameEntity);
}
