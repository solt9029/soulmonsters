import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameUserEntity } from 'src/entities/game-user.entity';

export function grantStartDrawTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== null || gameEntity.turnUserId !== userId) {
    return;
  }

  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({
          ...gameUser,
          actionTypes: [ActionType.START_DRAW_TIME],
        })
      : gameUser,
  );
}
