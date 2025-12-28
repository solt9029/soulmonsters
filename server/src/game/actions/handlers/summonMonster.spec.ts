import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { Zone, BattlePosition } from 'src/graphql/index';
import { handleSummonMonsterAction } from './summonMonster';
import { CardModel } from 'src/models/card.model';

describe('handleSummonMonsterAction', () => {
  it('should summon gameCard from HAND to BATTLE zone with cost', () => {
    const card = new CardModel({
      id: 1,
      cost: 3,
    });

    const gameCard = new GameCardModel({
      id: 1,
      zone: Zone.HAND,
      position: 0,
      card,
    });

    const gameUser = new GameUserModel({
      userId: 'user1',
      energy: 5,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard],
      gameUsers: [gameUser],
    });

    const result = handleSummonMonsterAction('user1', { gameCardId: 1, cost: 3 }, gameModel);

    const summonedCard = result.gameCards.find(gc => gc.id === 1);
    expect(summonedCard?.zone).toBe(Zone.BATTLE);
    expect(summonedCard?.battlePosition).toBe(BattlePosition.ATTACK);
    expect(summonedCard?.position).toBe(0);

    const user = result.gameUsers.find(gu => gu.userId === 'user1');
    expect(user?.energy).toBe(2);
  });

  it('should throw error when gameCard is not found', () => {
    const gameModel = new GameModel({
      gameCards: [],
      gameUsers: [],
    });

    expect(() => handleSummonMonsterAction('user1', { gameCardId: 999, cost: 0 }, gameModel)).toThrow(
      'GameCard with id 999 not found',
    );
  });

  it('should calculate correct battle position when multiple cards are in BATTLE zone', () => {
    const card1 = new CardModel({ id: 1, cost: 0 });
    const card2 = new CardModel({ id: 2, cost: 0 });

    const battleCard = new GameCardModel({
      id: 1,
      zone: Zone.BATTLE,
      position: 0,
      currentUserId: 'user1',
      card: card1,
    });

    const handCard = new GameCardModel({
      id: 2,
      zone: Zone.HAND,
      position: 0,
      currentUserId: 'user1',
      card: card2,
    });

    const gameUser = new GameUserModel({
      userId: 'user1',
      energy: 10,
    });

    const gameModel = new GameModel({
      gameCards: [battleCard, handCard],
      gameUsers: [gameUser],
    });

    const result = handleSummonMonsterAction('user1', { gameCardId: 2, cost: 0 }, gameModel);

    const summonedCard = result.gameCards.find(gc => gc.id === 2);
    expect(summonedCard?.zone).toBe(Zone.BATTLE);
    expect(summonedCard?.position).toBe(1);
  });
});
