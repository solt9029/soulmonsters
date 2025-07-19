import { GameEntity } from '../../../entities/game.entity';
import { Phase, ActionType } from '../../../graphql/index';

export function grantStartEndTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.BATTLE && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(value => value.userId === userId);
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [ActionType.START_END_TIME];
  }
}
