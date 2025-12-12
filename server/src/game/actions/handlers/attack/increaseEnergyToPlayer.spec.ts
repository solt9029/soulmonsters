import { GameModel } from '../../../../models/game.model';
import { GameUserEntity } from '../../../../entities/game-user.entity';
import { increaseEnergyToPlayer } from './increaseEnergyToPlayer';

describe('increaseEnergyToPlayer', () => {
  it('should increase player energy by 1', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          energy: 5,
        }),
        new GameUserEntity({
          userId: 'user2',
          energy: 3,
        }),
      ],
    });

    const result = increaseEnergyToPlayer(gameEntity, 'user1');

    expect(result.gameUsers[0]?.energy).toBe(6);
    expect(result.gameUsers[1]?.energy).toBe(3);
  });

  it('should not increase energy beyond MAX_ENERGY (8)', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          energy: 8,
        }),
      ],
    });

    const result = increaseEnergyToPlayer(gameEntity, 'user1');

    expect(result.gameUsers[0]?.energy).toBe(8);
  });
});
