import { GameModel } from '../../models/game.model';
import { GameUserModel } from '../../models/game-user.model';
import { addUserEnergy } from './addUserEnergy';

describe('addUserEnergy', () => {
  it('should add energy to specified user', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          userId: 'user1',
          energy: 3,
        }),
        new GameUserModel({
          userId: 'user2',
          energy: 5,
        }),
      ],
    });

    const result = addUserEnergy(gameEntity, 'user1', 2);

    expect(result.gameUsers[0]?.energy).toBe(5);
    expect(result.gameUsers[1]?.energy).toBe(5);
  });

  it('should not exceed MAX_ENERGY when adding energy', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          userId: 'user1',
          energy: 6,
        }),
        new GameUserModel({
          userId: 'user2',
          energy: 3,
        }),
      ],
    });

    const result = addUserEnergy(gameEntity, 'user1', 5);

    expect(result.gameUsers[0]?.energy).toBe(8);
    expect(result.gameUsers[1]?.energy).toBe(3);
  });

  it('should not change energy of other users', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          userId: 'user1',
          energy: 4,
        }),
        new GameUserModel({
          userId: 'user2',
          energy: 7,
        }),
      ],
    });

    const result = addUserEnergy(gameEntity, 'user1', 2);

    expect(result.gameUsers[0]?.energy).toBe(6);
    expect(result.gameUsers[1]?.energy).toBe(7);
  });
});
