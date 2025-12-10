import { Phase, ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameUserEntity } from 'src/entities/game-user.entity';

export function grantStartBattleTimeAction(gameEntity: GameEntity, userId: string) {
  if (gameEntity.phase !== Phase.SOMETHING || gameEntity.turnUserId !== userId) {
    return;
  }

  gameEntity.gameUsers = gameEntity.gameUsers.map(gameUser =>
    gameUser.userId === userId
      ? new GameUserEntity({
          ...gameUser,
          actionTypes: [ActionType.START_BATTLE_TIME],
        })
      : gameUser,
  );
}
