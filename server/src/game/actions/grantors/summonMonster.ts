import { Zone } from 'src/graphql';
import { Phase, Kind, ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameCardEntity } from 'src/entities/game-card.entity';

export function grantSummonMonsterAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== Phase.SOMETHING || gameEntity.turnUserId !== userId) {
    return;
  }

  gameEntity.gameCards = gameEntity.gameCards.map(gameCard => {
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
