import { GameCardModel } from '../../../../models/game-card.model';
import { GameModel } from '../../../../models/game.model';
import { Zone } from '../../../../graphql/index';
import { packHandPositions } from './packHandPositions';

describe('packHandPositions', () => {
  it('should pack hand positions after removing a card', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
          id: 1,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardModel({
          id: 2,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 1,
        }),
        new GameCardModel({
          id: 3,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 3,
        }),
        new GameCardModel({
          id: 4,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 4,
        }),
      ],
    });

    const result = packHandPositions(gameModel, 'user1', 1);

    expect(result.gameCards[0]?.position).toBe(0);
    expect(result.gameCards[1]?.position).toBe(1);
    expect(result.gameCards[2]?.position).toBe(2);
    expect(result.gameCards[3]?.position).toBe(3);
  });

  it('should only affect cards belonging to specified user', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
          id: 1,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardModel({
          id: 2,
          zone: Zone.HAND,
          currentUserId: 'user2',
          position: 2,
        }),
        new GameCardModel({
          id: 3,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 2,
        }),
      ],
    });

    const result = packHandPositions(gameModel, 'user1', 0);

    expect(result.gameCards[0]?.position).toBe(0);
    expect(result.gameCards[1]?.position).toBe(2);
    expect(result.gameCards[2]?.position).toBe(1);
  });

  it('should only affect cards in HAND zone', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
          id: 1,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardModel({
          id: 2,
          zone: Zone.BATTLE,
          currentUserId: 'user1',
          position: 2,
        }),
        new GameCardModel({
          id: 3,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 2,
        }),
      ],
    });

    const result = packHandPositions(gameModel, 'user1', 0);

    expect(result.gameCards[0]?.position).toBe(0);
    expect(result.gameCards[1]?.position).toBe(2);
    expect(result.gameCards[2]?.position).toBe(1);
  });
});
