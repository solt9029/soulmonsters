import { Phase, ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';

export function grantStartBattleTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase === Phase.SOMETHING && gameEntity.turnUserId === userId) {
    const yourGameUserIndex = gameEntity.gameUsers.findIndex(value => value.userId === userId);
    gameEntity.gameUsers[yourGameUserIndex].actionTypes = [ActionType.START_BATTLE_TIME];
  }
}
