import { Zone } from 'src/graphql';
import { Phase, Kind, ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { GameCardEntity } from 'src/entities/game-card.entity';

export function grantSummonMonsterAction(gameModel: GameModel, userId: string) {
  if (gameModel.phase !== Phase.SOMETHING || gameModel.turnUserId !== userId) {
    return;
  }

  gameModel.gameCards = gameModel.gameCards.map(gameCard => {
    const canSummon =
      gameCard && gameCard.zone === Zone.HAND && gameCard.currentUserId === userId && gameCard.kind === Kind.MONSTER;

    return canSummon
      ? new GameCardEntity({
          ...gameCard,
          actionTypes: [...gameCard.actionTypes, ActionType.SUMMON_MONSTER],
        })
      : gameCard;
  });
}
