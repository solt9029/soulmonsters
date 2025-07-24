import { GameCardEntity } from 'src/entities/game.card.entity';
import { Zone } from 'src/graphql';
import { putSoulGameCard } from './putSoulGameCard';
import { GameEntity } from 'src/entities/game.entity';

describe('putSoulGameCard', () => {
  it('should move a game card to soul zone with correct position', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [
        new GameCardEntity({
          id: 1,
          zone: Zone.SOUL,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardEntity({
          id: 2,
          zone: Zone.SOUL,
          currentUserId: 'user1',
          position: 1,
        }),
        new GameCardEntity({
          id: 3,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 0,
        }),
      ],
    });

    const result = putSoulGameCard(gameEntity, 'user1', 3);

    expect(result.gameCards[2].zone).toBe(Zone.SOUL);
    expect(result.gameCards[2].position).toBe(2);
  });
});
