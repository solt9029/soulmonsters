import { GameCardEntity } from '../../../../entities/game-card.entity';
import { GameEntity } from '../../../../entities/game.entity';
import { Zone } from '../../../../graphql';
import { destroyMonster } from './destroyMonster';

describe('destroyMonster', () => {
  it('should move monster from battle zone to soul zone', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [
        new GameCardEntity({
          id: 1,
          currentUserId: 'user1',
          zone: Zone.BATTLE,
          position: 0,
        }),
        new GameCardEntity({
          id: 2,
          currentUserId: 'user1',
          zone: Zone.SOUL,
          position: 0,
        }),
      ],
    });

    const result = destroyMonster(gameEntity, 1);

    expect(result.gameCards).toHaveLength(2);
    expect(result.gameCards[0]?.zone).toBe(Zone.SOUL);
    expect(result.gameCards[0]?.position).toBe(1);
    expect(result.gameCards[1]?.zone).toBe(Zone.SOUL);
    expect(result.gameCards[1]?.position).toBe(0);
  });

  it('should set position to 0 when no soul cards exist', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [
        new GameCardEntity({
          id: 1,
          currentUserId: 'user1',
          zone: Zone.BATTLE,
          position: 0,
        }),
      ],
    });

    const result = destroyMonster(gameEntity, 1);

    expect(result.gameCards[0]?.zone).toBe(Zone.SOUL);
    expect(result.gameCards[0]?.position).toBe(0);
  });
});
