import { ActionType, Phase } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';

export function grantStartSomethingTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.PUT && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(value => value.userId === userId);
    gameEntity.gameUsers[yourGameUserIndex].actionTypes.push(ActionType.START_SOMETHING_TIME);
  }
}
