import { GameModel } from '../../../../models/game.model';
import { GameUserModel } from '../../../../models/game-user.model';
import { subtractUserEnergy } from './subtractUserEnergy';

describe('subtractUserEnergy', () => {
  it('should subtract energy from specified user', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          userId: 'user1',
          energy: 8,
        }),
        new GameUserModel({
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
