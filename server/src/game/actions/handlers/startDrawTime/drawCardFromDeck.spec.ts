import { Zone } from 'src/graphql';
import { drawCardFromDeck } from './drawCardFromDeck';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';

describe('drawCardFromDeck', () => {
  it('should move top deck card to hand with correct position', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
          id: 1,
          zone: Zone.DECK,
          currentUserId: 'user1',
          position: 1,
        }),
        new GameCardModel({
          id: 2,
          zone: Zone.DECK,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardModel({
          id: 3,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 0,
        }),
      ],
    });

    const result = drawCardFromDeck(gameModel, 'user1');

    const drawnCard = result.gameCards.find(card => card.id === 1);
    expect(drawnCard?.zone).toBe(Zone.HAND);
    expect(drawnCard?.position).toBe(1);
  });
});
