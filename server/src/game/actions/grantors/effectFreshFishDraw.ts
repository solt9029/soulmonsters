import { GameModel } from '../../../models/game.model';
import { Zone, StateType, ActionType, Phase } from '../../../graphql/index';
import { GameCardModel } from '../../../models/game-card.model';
import { CARD_ID } from 'src/constants/card';

export function grantEffectFreshFishDrawAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const isFreshFishInBattleZone =
      gameCard.currentUserId === userId &&
      gameCard.zone === Zone.BATTLE &&
      gameCard.card?.id === CARD_ID.SARANIMIZUMIZUSHIISAKANA;

    if (!isFreshFishInBattleZone) {
      return gameCard;
    }

    const gameState = gameModel.gameStates.find(
      gameState =>
        gameState.state.type === StateType.EFFECT_FRESH_FISH_DRAW_COUNT && gameState.gameCardId === gameCard.id,
    );

    const hasAlreadyUsedEffect =
      gameState && gameState.state.type === StateType.EFFECT_FRESH_FISH_DRAW_COUNT && gameState.state.data.value > 0;

    if (hasAlreadyUsedEffect) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.EFFECT_FRESH_FISH_DRAW],
    });
  });

  return gameModel;
}
