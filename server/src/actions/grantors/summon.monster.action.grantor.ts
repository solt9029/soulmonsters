import { Zone } from 'src/graphql';
import { Phase, Kind, ActionType } from './../../graphql/index';
import { GameEntity } from './../../entities/game.entity';

export function grantSummonMonsterAction(
  gameEntity: GameEntity,
  userId: string,
) {
  if (
    gameEntity.phase === Phase.SOMETHING &&
    gameEntity.turnUserId === userId
  ) {
    for (let i = 0; i < gameEntity.gameCards.length; i++) {
      if (
        gameEntity.gameCards[i].zone === Zone.HAND &&
        gameEntity.gameCards[i].currentUserId === userId &&
        gameEntity.gameCards[i].kind === Kind.MONSTER
      ) {
        gameEntity.gameCards[i].actionTypes.push(ActionType.SUMMON_MONSTER);
      }
    }
  }
}
