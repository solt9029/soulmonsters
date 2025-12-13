import { GameModel } from '../../../models/game.model';
import { Zone, StateType, ActionType, Phase } from '../../../graphql/index';
import { GameCardModel } from '../../../models/game-card.model';

export function grantEffectRuteRuteDrawAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const isRuteruteInBattleZone =
      gameCard.currentUserId === userId && gameCard.zone === Zone.BATTLE && gameCard.card?.id === 1;

    if (!isRuteruteInBattleZone) {
      return gameCard;
    }

    const gameState = gameModel.gameStates.find(
      gameState =>
        gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCardId === gameCard.id,
    );

    const hasAlreadyUsedEffect =
      gameState && gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.state.data.value > 0;

    if (hasAlreadyUsedEffect) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.EFFECT_RUTERUTE_DRAW],
    });
  });
}
