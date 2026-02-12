import { GameModel } from '../../../models/game.model';
import { Zone, EffectType } from '../../../graphql';
import { destroyMonster } from './destroyMonster';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { CardModel } from 'src/models/card.model';

describe('destroyMonster', () => {
  it('should move monster from battle zone to soul zone', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
          id: 1,
          currentUserId: 'user1',
          zone: Zone.BATTLE,
          position: 0,
        }),
        new GameCardModel({
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
    const gameEntity = new GameModel({
      id: 1,
      gameCards: [
        new GameCardModel({
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

  it('should trigger ニセキサンチョウ effect when moved from battle to soul zone', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          id: 1,
          userId: 'user1',
          energy: 3,
        }),
      ],
      gameCards: [
        new GameCardModel({
          id: 1,
          currentUserId: 'user1',
          zone: Zone.BATTLE,
          position: 0,
          card: new CardModel({
            id: 14,
          }),
        }),
      ],
    });

    const result = destroyMonster(gameEntity, 1);

    expect(result.gameCards[0]?.zone).toBe(Zone.SOUL);
    expect(result.gameUsers[0]?.energy).toBe(3);
    expect(result.gamePendingEffects).toHaveLength(1);
    expect(result.gamePendingEffects[0]?.effectType).toBe(EffectType.NISEKISANCHOU_ENERGY_INCREASE);
    expect(result.gamePendingEffects[0]?.gameCardId).toBe(1);
    expect(result.gamePendingEffects[0]?.userId).toBe('user1');
  });

  it('should not trigger effect for non-ニセキサンチョウ cards', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          id: 1,
          userId: 'user1',
          energy: 3,
        }),
      ],
      gameCards: [
        new GameCardModel({
          id: 1,
          currentUserId: 'user1',
          zone: Zone.BATTLE,
          position: 0,
          card: new CardModel({
            id: 1,
          }),
        }),
      ],
    });

    const result = destroyMonster(gameEntity, 1);

    expect(result.gameCards[0]?.zone).toBe(Zone.SOUL);
    expect(result.gameUsers[0]?.energy).toBe(3);
    expect(result.gamePendingEffects).toHaveLength(0);
  });
});
