import { GameModel } from 'src/models/game.model';
import { GameUserEntity } from 'src/entities/game-user.entity';
import { increaseGameUserEnergy } from './increaseGameUserEnergy';

describe('increaseGameUserEnergy', () => {
  it('should increase user energy by 2', () => {
    const gameUser = new GameUserEntity();
    gameUser.userId = 'user1';
    gameUser.energy = 4;

    const gameEntity = new GameModel();
    gameEntity.gameUsers = [gameUser];

    const result = increaseGameUserEnergy(gameEntity, 'user1');

    expect(result.gameUsers[0]?.energy).toBe(6);
  });

  it('should cap energy at 8', () => {
    const gameUser = new GameUserEntity();
    gameUser.userId = 'user1';
    gameUser.energy = 7;

    const gameEntity = new GameModel();
    gameEntity.gameUsers = [gameUser];

    const result = increaseGameUserEnergy(gameEntity, 'user1');

    expect(result.gameUsers[0]?.energy).toBe(8);
  });
});
