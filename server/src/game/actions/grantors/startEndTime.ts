import { GameEntity } from '../../../entities/game.entity';
import { Phase, ActionType } from '../../../graphql/index';
import { GameUserEntity } from 'src/entities/game-user.entity';

export function grantStartEndTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== Phase.BATTLE || gameEntity.turnUserId !== userId) {
    return;
  }

  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({
          ...gameUser,
          actionTypes: [ActionType.START_END_TIME],
        })
      : gameUser,
  );
}
