import { GameEntity } from '../../../entities/game.entity';
import { Zone, StateType, ActionType, Phase } from '../../../graphql/index';
import { GameCardEntity } from '../../../entities/game.card.entity';

export function grantEffectRuteRuteDrawAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== Phase.SOMETHING || gameEntity.turnUserId !== userId) {
    return;
  }

  gameEntity.gameCards = gameEntity.gameCards.map(gameCard => {
    const isRuteruteInBattleZone =
      gameCard.currentUserId === userId && gameCard.zone === Zone.BATTLE && gameCard.card?.id === 1;

    if (!isRuteruteInBattleZone) {
      return gameCard;
    }

    const gameState = gameEntity.gameStates.find(
      gameState =>
        gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.gameCard?.id === gameCard.id,
    );

    const hasAlreadyUsedEffect =
      gameState && gameState.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT && gameState.state.data.value > 0;

    if (hasAlreadyUsedEffect) {
      return gameCard;
    }

    return new GameCardEntity({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.EFFECT_RUTERUTE_DRAW],
    });
  });
}
