import { GameEntity } from '../../../entities/game.entity';
import { Phase, ActionType } from '../../../graphql/index';
import { GameUserEntity } from 'src/entities/game-user.entity';

export function grantStartPutTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== Phase.ENERGY || gameEntity.turnUserId !== userId) {
    return;
  }

  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({
          ...gameUser,
          actionTypes: [ActionType.START_PUT_TIME],
        })
      : gameUser,
  );
}
