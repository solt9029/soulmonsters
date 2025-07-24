import { GameEntity } from '../../../../entities/game.entity';
import { GameUserEntity } from '../../../../entities/game.user.entity';
import { dealDamageToPlayer } from './dealDamageToPlayer';

describe('dealDamageToPlayer', () => {
  it('should deal damage to specified player', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          lifePoint: 8000,
        }),
        new GameUserEntity({
          userId: 'user2',
          lifePoint: 8000,
        }),
      ],
    });

    const result = dealDamageToPlayer(gameEntity, 'user1', 1000);

    expect(result.gameUsers).toHaveLength(2);
    expect(result.gameUsers[0]?.lifePoint).toBe(7000);
    expect(result.gameUsers[1]?.lifePoint).toBe(8000);
  });

  it('should handle damage that reduces life to zero or below', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          lifePoint: 500,
        }),
      ],
    });

    const result = dealDamageToPlayer(gameEntity, 'user1', 1000);

    expect(result.gameUsers[0]?.lifePoint).toBe(-500);
  });
});