import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';
import { Zone, BattlePosition } from 'src/graphql/index';
import { moveTargetMonsterToMorgue } from './moveTargetMonsterToMorgue';

describe('moveTargetMonsterToMorgue', () => {
  it('should move target monster to morgue with correct position', () => {
    const gameUser1 = new GameUserModel({ id: 1, userId: 'user1' });
    const gameUser2 = new GameUserModel({ id: 2, userId: 'user2' });
    const card = new CardModel({ id: 1 });

    const targetGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.ATTACK,
      card: card,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser1, gameUser2],
      gameCards: [targetGameCard],
    });

    const result = moveTargetMonsterToMorgue(gameModel, targetGameCard);

    const movedCard = result.gameCards.find(gc => gc.id === 1);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(0);
    expect(movedCard?.battlePosition).toBe(null);
  });

  it('should clear battlePosition when moving from battle to morgue', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const targetGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.DEFENSE,
      card: card,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [targetGameCard],
    });

    const result = moveTargetMonsterToMorgue(gameModel, targetGameCard);

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

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.ATTACK,
      card: card2,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [existingMorgueCard, targetGameCard],
    });

    const result = moveTargetMonsterToMorgue(gameModel, targetGameCard);

    const movedCard = result.gameCards.find(gc => gc.id === 2);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(1);
  });

  it('should handle moving card to morgue for different user', () => {
    const gameUser1 = new GameUserModel({ id: 1, userId: 'user1' });
    const gameUser2 = new GameUserModel({ id: 2, userId: 'user2' });
    const card1 = new CardModel({ id: 1 });
    const card2 = new CardModel({ id: 2 });

    // Existing morgue card for user1
    const user1MorgueCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.MORGUE,
      position: 0,
      card: card1,
    });

    // Target card belonging to user2
    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.ATTACK,
      card: card2,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser1, gameUser2],
      gameCards: [user1MorgueCard, targetGameCard],
    });

    const result = moveTargetMonsterToMorgue(gameModel, targetGameCard);

    const movedCard = result.gameCards.find(gc => gc.id === 2);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(0); // First card in user2's morgue
    expect(movedCard?.currentUserId).toBe('user2');
  });

  it('should work with cards from any zone, not just battle', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const targetGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      position: 2,
      card: card,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [targetGameCard],
    });

    const result = moveTargetMonsterToMorgue(gameModel, targetGameCard);

    const movedCard = result.gameCards.find(gc => gc.id === 1);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(0);
    expect(movedCard?.battlePosition).toBe(null);
  });

  it('should preserve all other card properties', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 123 });

    const targetGameCard = new GameCardModel({
      id: 456,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.ATTACK,
      card: card,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [targetGameCard],
    });

    const result = moveTargetMonsterToMorgue(gameModel, targetGameCard);

    const movedCard = result.gameCards.find(gc => gc.id === 456);
    expect(movedCard?.id).toBe(456);
    expect(movedCard?.currentUserId).toBe('user1');
    expect(movedCard?.card).toBe(card);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.battlePosition).toBe(null);
  });
});