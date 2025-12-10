import { GameEntity } from '../../../entities/game.entity';
import { Zone, StateType } from 'src/graphql';
import { Phase, BattlePosition, ActionType } from '../../../graphql/index';
import { GameCardEntity } from 'src/entities/game-card.entity';

export function grantAttackAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== Phase.BATTLE || gameEntity.turnUserId !== userId) {
    return;
  }

  gameEntity.gameCards = gameEntity.gameCards.map(gameCard => {
    const isAttackable =
      gameCard.zone === Zone.BATTLE &&
      gameCard.battlePosition === BattlePosition.ATTACK &&
      gameCard.currentUserId === userId;

    if (!isAttackable) {
      return gameCard;
    }

    const attackCountGameState = gameEntity.gameStates.find(
      gameState => gameState.gameCard?.id === gameCard.id && gameState.state.type === StateType.ATTACK_COUNT,
    );

    if (attackCountGameState && attackCountGameState.state.data['value'] > 0) {
      return gameCard;
    }

    return new GameCardEntity({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.ATTACK],
    });
  });
}
