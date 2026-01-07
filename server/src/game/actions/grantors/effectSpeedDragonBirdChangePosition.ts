import { GameModel } from 'src/models/game.model';
import { Zone, ActionType, Phase } from 'src/graphql/index';
import { GameCardModel } from 'src/models/game-card.model';
import { CARD_ID } from 'src/constants/card';

export function grantEffectSpeedDragonBirdChangePositionAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const isSpeedDragonBirdInBattleZone =
      gameCard.currentUserId === userId &&
      gameCard.zone === Zone.BATTLE &&
      gameCard.card?.id === CARD_ID.SPEEDDRAGONANDSPEEDBIRD;

    if (!isSpeedDragonBirdInBattleZone) {
      return gameCard;
    }

    return new GameCardModel({
      ...gameCard,
      actionTypes: [...gameCard.actionTypes, ActionType.EFFECT_SPEED_DRAGON_BIRD_CHANGE_POSITION],
    });
  });

  return gameModel;
}
