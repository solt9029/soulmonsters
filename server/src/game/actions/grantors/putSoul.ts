import { GameEntity } from '../../../entities/game.entity';
import { Zone, StateType } from 'src/graphql';
import { Phase, ActionType } from '../../../graphql/index';
import { GameCardEntity } from 'src/entities/game-card.entity';

export function grantPutSoulAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== Phase.PUT || gameEntity.turnUserId !== userId) {
    return;
  }

  const yourGameUser = gameEntity.gameUsers.find(value => value.userId === userId);
  if (!yourGameUser) {
    return;
  }

  const putSoulGameState = gameEntity.gameStates.find(
    gameState =>
      gameState.state.type === StateType.PUT_SOUL_COUNT && gameState.state.data.gameUserId === yourGameUser.id,
  );

  if (putSoulGameState?.state.data['value'] || 0 > 0) {
    return;
  }

  gameEntity.gameCards = gameEntity.gameCards.map(gameCard => {
    const canPutSoul = gameCard && gameCard.zone === Zone.HAND && gameCard.currentUserId === userId;

    return canPutSoul
      ? new GameCardEntity({
          ...gameCard,
          actionTypes: [...gameCard.actionTypes, ActionType.PUT_SOUL],
        })
      : gameCard;
  });
}
