import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';
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

export const cleanGameStates = (gameModel: GameModel, gameUser: GameUserModel): GameModel => {
  gameModel.gameStates = gameModel.gameStates.filter(
    gameState =>
      !(
        isAttackCountState(gameState, gameUser.userId) ||
        isPutSoulCountState(gameState, gameUser.id) ||
        isEffectRuteruteDrawCountState(gameState)
      ),
  );

  return gameModel;
};
