import { GameModel } from 'src/models/game.model';
import { Zone, StateType, ActionType, Phase } from 'src/graphql/index';
import { GameCardModel } from 'src/models/game-card.model';
import { CARD_ID } from 'src/constants/card';

export function grantEffectNatsukashinorudePowerDownAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const isNatsukashinorudeInBattleZone =
      gameCard.currentUserId === userId &&
      gameCard.zone === Zone.BATTLE &&
      gameCard.card?.id === CARD_ID.NATSUKASHINORUDE;

    if (!isNatsukashinorudeInBattleZone) {
      return gameCard;
    }

    const gameState = gameModel.gameStates.find(
      gameState =>
        gameState.state.type === StateType.EFFECT_NATSUKASHINORUDE_USE_COUNT && gameState.gameCardId === gameCard.id,
    );

    const hasAlreadyUsedEffect =
      gameState &&
      gameState.state.type === StateType.EFFECT_NATSUKASHINORUDE_USE_COUNT &&
      gameState.state.data.value > 0;

    if (hasAlreadyUsedEffect) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN],
    });
  });

  return gameModel;
}
