import { CARD_ID } from './../../../constants/card';
import { GameModel } from '../../../models/game.model';
import { Zone, StateType, ActionType, Phase } from '../../../graphql/index';
import { GameCardModel } from '../../../models/game-card.model';

export function grantEffectEmeraldEnergyIncreaseAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const isEmeraldInBattleZone =
      gameCard.currentUserId === userId &&
      gameCard.zone === Zone.BATTLE &&
      gameCard.card?.id === CARD_ID.MORINOMUROSAEMERARL;

    if (!isEmeraldInBattleZone) {
      return gameCard;
    }

    const gameState = gameModel.gameStates.find(
      gameState =>
        gameState.state.type === StateType.EFFECT_EMERALD_ENERGY_INCREASE_COUNT && gameState.gameCardId === gameCard.id,
    );

    const hasAlreadyUsedEffect =
      gameState && gameState.state.type === StateType.EFFECT_EMERALD_ENERGY_INCREASE_COUNT && gameState.state.data.value > 0;

    if (hasAlreadyUsedEffect) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.EFFECT_EMERALD_ENERGY_INCREASE],
    });
  });

  return gameModel;
}