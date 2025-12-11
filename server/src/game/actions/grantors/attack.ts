import { GameModel } from '../../../models/game.model';
import { Zone, StateType } from 'src/graphql';
import { Phase, BattlePosition, ActionType } from '../../../graphql/index';
import { GameCardEntity } from 'src/entities/game-card.entity';

export function grantAttackAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.BATTLE || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const isAttackable =
      gameCard.zone === Zone.BATTLE &&
      gameCard.battlePosition === BattlePosition.ATTACK &&
      gameCard.currentUserId === userId;

    if (!isAttackable) {
      return gameCard;
    }

    const attackCountGameState = gameModel.gameStates.find(
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
