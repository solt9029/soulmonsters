import { BadRequestException } from '@nestjs/common';
import { GameEntity } from '../../../entities/game.entity';
import { GameUserEntity } from '../../../entities/game-user.entity';
import { ActionType } from '../../../graphql/index';
import { validateStartBattleTimeAction } from './startBattleTime';

describe('validateStartBattleTimeAction', () => {
  it('should not throw when user has START_BATTLE_TIME action type', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          actionTypes: [ActionType.START_BATTLE_TIME],
        }),
      ],
    });

    expect(() => validateStartBattleTimeAction(gameEntity, 'user1')).not.toThrow();
  });

  it('should throw BadRequestException when user does not have START_BATTLE_TIME action type', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          actionTypes: [],
        }),
      ],
    });

    expect(() => validateStartBattleTimeAction(gameEntity, 'user1')).toThrow(BadRequestException);
  });

  it('should throw BadRequestException when user is not found', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameUsers: [],
    });

    expect(() => validateStartBattleTimeAction(gameEntity, 'user1')).toThrow(BadRequestException);
  });
});
