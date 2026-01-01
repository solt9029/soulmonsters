import { Zone } from 'src/graphql';
import { calcNewMorgueGameCardPosition } from './calcNewMorgueGameCardPosition';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';

describe('calcNewMorgueGameCardPosition', () => {
  it('should return 0 when MORGUE zone is empty', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [],
    });

    const result = calcNewMorgueGameCardPosition(gameModel, 'user1');

    expect(result).toBe(0);
  });

  it('should return max position + 1 when MORGUE has cards', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
          id: 1,
          zone: Zone.MORGUE,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardModel({
          id: 2,
          zone: Zone.MORGUE,
          currentUserId: 'user1',
          position: 1,
        }),
        new GameCardModel({
          id: 3,
          zone: Zone.MORGUE,
          currentUserId: 'user1',
          position: 2,
        }),
      ],
    });

    const result = calcNewMorgueGameCardPosition(gameModel, 'user1');

    expect(result).toBe(3);
  });

  it('should ignore cards in MORGUE zone belonging to other users', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
          id: 1,
          zone: Zone.MORGUE,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardModel({
          id: 2,
          zone: Zone.MORGUE,
          currentUserId: 'user2',
          position: 5,
        }),
        new GameCardModel({
          id: 3,
          zone: Zone.MORGUE,
          currentUserId: 'user1',
          position: 1,
        }),
      ],
    });

    const result = calcNewMorgueGameCardPosition(gameModel, 'user1');

    expect(result).toBe(2);
  });

  it('should ignore cards in other zones', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
          id: 1,
          zone: Zone.MORGUE,
          currentUserId: 'user1',
          position: 0,
        }),
        new GameCardModel({
          id: 2,
          zone: Zone.HAND,
          currentUserId: 'user1',
          position: 5,
        }),
        new GameCardModel({
          id: 3,
          zone: Zone.BATTLE,
          currentUserId: 'user1',
          position: 3,
        }),
      ],
    });

    const result = calcNewMorgueGameCardPosition(gameModel, 'user1');

    expect(result).toBe(1);
  });
});
