import { GameModel } from '../../../models/game.model';
import { Zone, StateType } from 'src/graphql';
import { Phase, ActionType } from '../../../graphql/index';
import { GameCardModel } from 'src/models/game-card.model';

export function grantPutSoulAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.PUT || gameModel.turnUserId !== userId) {
    return;
  }

  const yourGameUser = gameModel.gameUsers.find(value => value.userId === userId);
  if (!yourGameUser) {
    return;
  }

  const putSoulGameState = gameModel.gameStates.find(
    gameState =>
      gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === yourGameUser.id,
  );

  if (putSoulGameState?.state.data['value'] || 0 > 0) {
    return;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const canPutSoul = gameCard && gameCard.zone === Zone.HAND && gameCard.currentUserId === userId;

    return canPutSoul
      ? new GameCardModel({
          ...gameCard,
          actionTypes: [...gameCard.actionTypes, ActionType.PUT_SOUL],
        })
      : gameCard;
  });
}
