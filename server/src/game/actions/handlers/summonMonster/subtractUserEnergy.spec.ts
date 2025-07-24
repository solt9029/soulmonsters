import { GameEntity } from '../../../../entities/game.entity';
import { GameUserEntity } from '../../../../entities/game.user.entity';
import { subtractUserEnergy } from './subtractUserEnergy';

describe('subtractUserEnergy', () => {
  it('should subtract energy from specified user', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          energy: 8,
        }),
        new GameUserEntity({
          userId: 'user2',
          energy: 5,
        }),
      ],
    });

    const result = subtractUserEnergy(gameEntity, 'user1', 3);

    expect(result.gameUsers[0]?.energy).toBe(5);
    expect(result.gameUsers[1]?.energy).toBe(5);
  });
});
