import { GameStateEntity } from './../../entities/game.state.entity';
import { GameEntity } from './../../entities/game.entity';
import { EntityManager } from 'typeorm';
import { GameRepository } from 'src/repositories/game.repository';
import { StateType } from 'src/graphql';

function isAttackCountState(gameState: GameStateEntity, userId: string) {
  return gameState.state.type === StateType.ATTACK_COUNT && gameState.gameCard.currentUserId === userId;
}

function isPutSoulCountState(gameState: GameStateEntity, gameUserId: number) {
  return gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId;
}

export async function handleFinishEndTimeAction(manager: EntityManager, userId: string, id: number, game: GameEntity) {
  const gameRepository = manager.getCustomRepository(GameRepository);
  const opponentGameUser = game.gameUsers.find(value => value.userId !== userId);

  await gameRepository.update({ id }, { phase: null, turnUserId: opponentGameUser.userId });

  // delete rule states
  const yourGameUser = game.gameUsers.find(value => value.userId === userId);
  const gameStates = await manager.find(GameStateEntity, {
    relations: ['gameCard'],
    where: { game },
  });
  const filteredGameStateIds = gameStates
    .filter(gameState => isAttackCountState(gameState, userId) || isPutSoulCountState(gameState, yourGameUser.id))
    .map(gameState => gameState.id);

  if (filteredGameStateIds.length > 0) {
    await manager.delete(GameStateEntity, filteredGameStateIds);
  }
}
