import { GameStateEntity } from '../../../entities/game.state.entity';
import { GameEntity } from '../../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/repositories/game.repository';
import { StateType } from 'src/graphql';

function isAttackCountState(gameState: GameStateEntity, userId: string) {
  return gameState.state.type === StateType.ATTACK_COUNT && gameState.gameCard.currentUserId === userId;
}

function isPutSoulCountState(gameState: GameStateEntity, gameUserId: number) {
  return gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId;
}

const findCleanableGameStateIds = (gameEntity: GameEntity, userId: string) => {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!gameUser) {
    throw new Error('Game user not found');
  }

  return gameEntity.gameStates
    .filter(gameState => isAttackCountState(gameState, userId) || isPutSoulCountState(gameState, gameUser.id))
    .map(gameState => gameState.id);
};

export async function handleFinishEndTimeAction(manager: EntityManager, userId: string, id: number, game: GameEntity) {
  const gameRepository = manager.withRepository(GameRepository);
  const opponentGameUser = game.gameUsers.find(value => value.userId !== userId);

  if (!opponentGameUser) {
    throw new Error('Opponent game user not found');
  }

  await gameRepository.update({ id }, { phase: null, turnUserId: opponentGameUser.userId });

  const cleanableGameStateIds = findCleanableGameStateIds(game, userId);

  if (cleanableGameStateIds.length > 0) {
    await manager.delete(GameStateEntity, cleanableGameStateIds);
  }
}
