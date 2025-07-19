import { GameEntity } from '../../../entities/game.entity';
import { Phase, ActionType } from '../../../graphql/index';

export function grantStartPutTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.ENERGY && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(value => value.userId === userId);
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [ActionType.START_PUT_TIME];
  }
}
