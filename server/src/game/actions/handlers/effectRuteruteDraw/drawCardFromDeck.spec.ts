import { GameModel } from 'src/models/game.model';
import { Zone } from 'src/graphql';
import { drawCardFromDeck } from './drawCardFromDeck';
import { GameCardModel } from 'src/models/game-card.model';

describe('drawCardFromDeck', () => {
  it('should move top deck card to hand', () => {
    const gameEntity = new GameModel();
    gameEntity.gameCards = [
      new GameCardModel({
        id: 1,
        zone: Zone.DECK,
        position: 5,
        currentUserId: 'user1',
        originalUserId: 'user1',
        name: 'Test Card',
      }),
      new GameCardModel({
        id: 2,
        zone: Zone.HAND,
        position: 0,
        currentUserId: 'user1',
        originalUserId: 'user1',
        name: 'Hand Card',
      }),
    ];

    const result = drawCardFromDeck(gameEntity, 'user1');

    const drawnCard = result.gameCards.find(card => card.id === 1);
    expect(drawnCard?.zone).toBe(Zone.HAND);
    expect(drawnCard?.position).toBe(1);
  });

  it('should return unchanged game when deck is empty', () => {
    const gameEntity = new GameModel();
    gameEntity.gameCards = [
      new GameCardModel({
        id: 1,
        zone: Zone.HAND,
        position: 0,
        currentUserId: 'user1',
        originalUserId: 'user1',
        name: 'Hand Card',
      }),
    ];

    const result = drawCardFromDeck(gameEntity, 'user1');

    expect(result.gameCards).toHaveLength(1);
    expect(result.gameCards[0]?.zone).toBe(Zone.HAND);
  });
});
