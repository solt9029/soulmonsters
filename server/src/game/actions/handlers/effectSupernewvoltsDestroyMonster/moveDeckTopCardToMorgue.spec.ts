import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';
import { Zone, BattlePosition } from 'src/graphql/index';
import { moveDeckTopCardToMorgue } from './moveDeckTopCardToMorgue';

describe('moveDeckTopCardToMorgue', () => {
  it('should move top deck card to morgue with correct position', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card1 = new CardModel({ id: 1 });
    const card2 = new CardModel({ id: 2 });

    const topDeckCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.DECK,
      position: 0,
      card: card1,
    });

    const bottomDeckCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.DECK,
      position: 1,
      card: card2,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [bottomDeckCard, topDeckCard], // Order doesn't matter - should sort by position
    });

    const result = moveDeckTopCardToMorgue(gameModel, 'user1');

    const movedCard = result.gameCards.find(gc => gc.id === 1);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(0);
    expect(movedCard?.battlePosition).toBe(null);

    const remainingDeckCard = result.gameCards.find(gc => gc.id === 2);
    expect(remainingDeckCard?.zone).toBe(Zone.DECK);
    expect(remainingDeckCard?.position).toBe(1);
  });

  it('should return unchanged model when no deck cards exist for user', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const handCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      position: 0,
      card: card,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [handCard],
    });

    const result = moveDeckTopCardToMorgue(gameModel, 'user1');

    expect(result).toBe(gameModel);
    expect(result.gameCards[0]?.zone).toBe(Zone.HAND);
  });

  it('should only move cards for specified user', () => {
    const gameUser1 = new GameUserModel({ id: 1, userId: 'user1' });
    const gameUser2 = new GameUserModel({ id: 2, userId: 'user2' });
    const card1 = new CardModel({ id: 1 });
    const card2 = new CardModel({ id: 2 });

    const user1DeckCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.DECK,
      position: 0,
      card: card1,
    });

    const user2DeckCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.DECK,
      position: 0,
      card: card2,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser1, gameUser2],
      gameCards: [user1DeckCard, user2DeckCard],
    });

    const result = moveDeckTopCardToMorgue(gameModel, 'user1');

    const user1Card = result.gameCards.find(gc => gc.id === 1);
    expect(user1Card?.zone).toBe(Zone.MORGUE);

    const user2Card = result.gameCards.find(gc => gc.id === 2);
    expect(user2Card?.zone).toBe(Zone.DECK);
  });

  it('should clear battlePosition when moving card from deck to morgue', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const deckCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.DECK,
      position: 0,
      battlePosition: BattlePosition.ATTACK, // This shouldn't exist but test clearing
      card: card,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [deckCard],
    });

    const result = moveDeckTopCardToMorgue(gameModel, 'user1');

    const movedCard = result.gameCards.find(gc => gc.id === 1);
    expect(movedCard?.battlePosition).toBe(null);
  });

  it('should calculate correct morgue position when morgue has existing cards', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card1 = new CardModel({ id: 1 });
    const card2 = new CardModel({ id: 2 });

    const existingMorgueCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.MORGUE,
      position: 0,
      card: card1,
    });

    const deckCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.DECK,
      position: 0,
      card: card2,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [existingMorgueCard, deckCard],
    });

    const result = moveDeckTopCardToMorgue(gameModel, 'user1');

    const movedCard = result.gameCards.find(gc => gc.id === 2);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(1);
  });
});