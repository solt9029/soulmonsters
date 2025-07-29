import { GameEntity } from '../../../entities/game.entity';
import { Zone, StateType, ActionType } from '../../../graphql/index';
import { GameCardEntity } from '../../../entities/game.card.entity';

export function grantEffectAction(gameEntity: GameEntity, userId: string) {
  const yourGameUser = gameEntity.gameUsers.find(value => value.userId === userId);
  if (!yourGameUser) {
    return;
  }

  gameEntity.gameCards = gameEntity.gameCards.map(gameCard => {
    const isRuteruteInBattleZone = 
      gameCard.currentUserId === userId &&
      gameCard.zone === Zone.BATTLE &&
      gameCard.card?.id === 1;

    if (!isRuteruteInBattleZone) {
      return gameCard;
    }

    const effectUseState = gameEntity.gameStates.find(
      gameState =>
        gameState.state.type === StateType.EFFECT_USE_COUNT &&
        gameState.state.data.effectType === 'RUTERUTE_DRAW' &&
        gameState.state.data.gameUserId === yourGameUser.id,
    );

    const hasAlreadyUsedEffect = effectUseState && 
      effectUseState.state.type === StateType.EFFECT_USE_COUNT && 
      effectUseState.state.data.value > 0;

    if (hasAlreadyUsedEffect) {
      return gameCard;
    }

    return new GameCardEntity({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.EFFECT_RUTERUTE_DRAW],
    });
  });
}