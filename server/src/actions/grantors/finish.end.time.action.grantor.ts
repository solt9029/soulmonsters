import { GameEntity } from './../../entities/game.entity';
import { Phase, ActionType } from './../../graphql/index';

export function grantFinishEndTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.END && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(value => value.userId === userId);
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [ActionType.FINISH_END_TIME];
  }
}
