import { GameEntity } from './../../entities/game.entity';
import { Zone, StateType } from 'src/graphql';
import { Phase, ActionType } from './../../graphql/index';

export function grantPutSoulAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.PUT && gameEntity.turnUserId === userId) {
    const yourGameUser = gameEntity.gameUsers.find(
      value => value.userId === userId,
    );
    const putSoulGameState = gameEntity.gameStates.find(
      gameState =>
        gameState.state.type === StateType.PUT_SOUL_COUNT &&
        gameState.state.data.gameUserId === yourGameUser.id,
    );

    if (putSoulGameState?.state.data['value'] || 0 > 0) {
      return;
    }

    for (let i = 0; i < gameEntity.gameCards.length; i++) {
      if (
        gameEntity.gameCards[i].zone === Zone.HAND &&
        gameEntity.gameCards[i].currentUserId === userId
      ) {
        gameEntity.gameCards[i].actionTypes.push(ActionType.PUT_SOUL);
      }
    }
  }
}
