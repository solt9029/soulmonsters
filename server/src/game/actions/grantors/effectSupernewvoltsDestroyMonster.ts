import { CARD_ID } from 'src/constants/card';
import { GameModel } from 'src/models/game.model';
import { Zone, StateType, ActionType, Phase } from 'src/graphql/index';
import { GameCardModel } from 'src/models/game-card.model';

export function grantEffectSupernewvoltsDestroyMonsterAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  const hasCardsInDeck = gameModel.gameCards.some(gc => gc.currentUserId === userId && gc.zone === Zone.DECK);

  if (!hasCardsInDeck) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const isSupernewvoltsInBattleZone =
      gameCard.currentUserId === userId && gameCard.zone === Zone.BATTLE && gameCard.card?.id === CARD_ID.SUPERNEWVOLTS;

    if (!isSupernewvoltsInBattleZone) {
      return gameCard;
    }

    const gameState = gameModel.gameStates.find(
      gs => gs.state.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT && gs.gameCardId === gameCard.id,
    );

    const hasAlreadyUsedEffect =
      gameState &&
      gameState.state.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT &&
      gameState.state.data.value > 0;

    if (hasAlreadyUsedEffect) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER],
    });
  });

  return gameModel;
}
