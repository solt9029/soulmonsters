import { GameEntity } from 'src/entities/game.entity';
import { StateType } from 'src/graphql';

const isAttackCountState = (gameState: any, userId: string): boolean => {
  return gameState.state.type === StateType.ATTACK_COUNT && gameState.gameCard.currentUserId === userId;
};

const isPutSoulCountState = (gameState: any, gameUserId: number): boolean => {
  return gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === gameUserId;
};

const isEffectRuteruteDrawCountState = (gameState: any): boolean => {
  return gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT;
};

export const cleanGameStates = (gameEntity: GameEntity, userId: string): GameEntity => {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!gameUser) {
    throw new Error('Game user not found');
  }

  gameEntity.gameStates = gameEntity.gameStates.filter(
    gameState =>
      !(
        isAttackCountState(gameState, userId) ||
        isPutSoulCountState(gameState, gameUser.id) ||
        isEffectRuteruteDrawCountState(gameState)
      ),
  );

  return gameEntity;
};
