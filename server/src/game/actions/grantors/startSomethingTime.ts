import { ActionType, Phase } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameUserEntity } from 'src/entities/game-user.entity';

export function grantStartSomethingTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== Phase.PUT || gameEntity.turnUserId !== userId) {
    return;
  }

  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({
          ...gameUser,
          actionTypes: [...gameUser.actionTypes, ActionType.START_SOMETHING_TIME],
        })
      : gameUser,
  );
}
