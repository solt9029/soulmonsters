import { GameModel } from '../../../models/game.model';
import { Zone, StateType } from 'src/graphql';
import { Phase, BattlePosition, ActionType } from '../../../graphql/index';
import { GameCardModel } from 'src/models/game-card.model';

export function grantAttackAction(gameModel: GameModel, userId: string): GameModel {
  if (gameModel.phase !== Phase.BATTLE || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  if (gameModel.turnCount <= 1) {
    return gameModel;
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
      gameState => gameState.gameCardId === gameCard.id && gameState.state.type === StateType.ATTACK_COUNT,
    );

    if (attackCountGameState && attackCountGameState.state.data['value'] > 0) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.ATTACK],
    });
  });

  return gameModel;
}
