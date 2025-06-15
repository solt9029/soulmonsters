import { GameEntity } from './../../entities/game.entity';
import { Zone, StateType } from 'src/graphql';
import { Phase, BattlePosition, ActionType } from './../../graphql/index';

export function grantAttackAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.BATTLE && gameEntity.turnUserId === userId) {
    for (let i = 0; i < gameEntity.gameCards.length; i++) {
      if (
        gameEntity.gameCards[i].zone === Zone.BATTLE &&
        gameEntity.gameCards[i].battlePosition === BattlePosition.ATTACK &&
        gameEntity.gameCards[i].currentUserId === userId
      ) {
        const attackCountGameState = gameEntity.gameStates.find(
          gameState =>
            gameState.gameCard?.id === gameEntity.gameCards[i].id &&
            gameState.state.type === StateType.ATTACK_COUNT,
        );
        if (attackCountGameState?.state.data['value'] || 0 === 0) {
          gameEntity.gameCards[i].actionTypes.push(ActionType.ATTACK);
        }
      }
    }
  }
}
