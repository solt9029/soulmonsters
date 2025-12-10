import { GameEntity } from 'src/entities/game.entity';
import { GameUserEntity } from 'src/entities/game-user.entity';
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

export const cleanGameStates = (gameEntity: GameEntity, gameUser: GameUserEntity): GameEntity => {
  gameEntity.gameStates = gameEntity.gameStates.filter(
    gameState =>
      !(
        isAttackCountState(gameState, gameUser.userId) ||
        isPutSoulCountState(gameState, gameUser.id) ||
        isEffectRuteruteDrawCountState(gameState)
      ),
  );

  return gameEntity;
};
