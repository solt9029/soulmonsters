import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameEntity } from 'src/entities/game.entity';
import { Zone } from 'src/graphql';
import { drawCardFromDeck } from './drawCardFromDeck';

describe('drawCardFromDeck', () => {
  it('should move top deck card to hand with correct position', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [
        new GameCardEntity({
          id: 1,
          zone: Zone.DECK,
          currentUserId: 'user1',
          position: 1,
        }),
        new GameCardEntity({
          id: 2,
          zone: Zone.DECK,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardEntity({
          id: 3,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 0,
        }),
      ],
    });

    const result = drawCardFromDeck(gameEntity, 'user1');

    const drawnCard = result.gameCards.find(card => card.id === 1);
    expect(drawnCard?.zone).toBe(Zone.HAND);
    expect(drawnCard?.position).toBe(1);
  });
});
