import { GameEntity } from 'src/entities/game.entity';
import { GameUserEntity } from 'src/entities/game-user.entity';
import { Phase } from 'src/graphql';
import { switchToOpponentTurn } from './switchToOpponentTurn';

describe('switchToOpponentTurn', () => {
  it('should switch turn to opponent user and reset phase', () => {
    const gameEntity = new GameEntity({
      id: 1,
      phase: Phase.END,
      turnUserId: 'user1',
      gameUsers: [new GameUserEntity({ userId: 'user1' }), new GameUserEntity({ userId: 'user2' })],
    });

    const result = switchToOpponentTurn(gameEntity, new GameUserEntity({ userId: 'user2' }));

    expect(result.turnUserId).toBe('user2');
    expect(result.phase).toBeNull();
  });
});
