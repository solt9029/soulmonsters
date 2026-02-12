import { GameModel } from '../../../models/game.model';
import { GameUserModel } from '../../../models/game-user.model';
import { EffectType } from '../../../graphql';
import { directAttack } from './directAttack';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';

describe('directAttack', () => {
  it('should deal damage to opponent player based on attacker card attack', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          userId: 'user1',
          lifePoint: 8000,
        }),
        new GameUserModel({
          userId: 'user2',
          lifePoint: 8000,
        }),
      ],
      gameCards: [
        new GameCardModel({
          id: 1,
          attack: 1500,
          card: new CardModel({
            id: 1,
          }),
        }),
      ],
    });

    const result = directAttack(gameEntity, 1, 'user2');

    expect(result.gameUsers[1]?.lifePoint).toBe(6500);
  });

  it('should add REITETSUNATOTI_DRAW pending effect when card ID 11 (冷徹な鳥) performs direct attack', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          userId: 'user1',
          lifePoint: 8000,
        }),
        new GameUserModel({
          userId: 'user2',
          lifePoint: 8000,
        }),
      ],
      gameCards: [
        new GameCardModel({
          id: 1,
          attack: 600,
          currentUserId: 'user1',
          card: new CardModel({
            id: 11,
          }),
        }),
      ],
    });

    const result = directAttack(gameEntity, 1, 'user2');

    expect(result.gamePendingEffects).toHaveLength(1);
    expect(result.gamePendingEffects[0]?.effectType).toBe(EffectType.REITETSUNATOTI_DRAW);
    expect(result.gamePendingEffects[0]?.gameCardId).toBe(1);
    expect(result.gamePendingEffects[0]?.userId).toBe('user1');
    expect(result.gameUsers[1]?.lifePoint).toBe(7400);
  });

  it('should add SAIFUKKATSUSHITATAKIBEE_DAMAGE pending effect when card ID 2 (再復活したタキビー) performs direct attack', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserModel({
          userId: 'user1',
          lifePoint: 8000,
        }),
        new GameUserModel({
          userId: 'user2',
          lifePoint: 8000,
        }),
      ],
      gameCards: [
        new GameCardModel({
          id: 1,
          attack: 1600,
          currentUserId: 'user1',
          card: new CardModel({
            id: 2,
          }),
        }),
      ],
    });

    const result = directAttack(gameEntity, 1, 'user2');

    expect(result.gamePendingEffects).toHaveLength(1);
    expect(result.gamePendingEffects[0]?.effectType).toBe(EffectType.SAIFUKKATSUSHITATAKIBEE_DAMAGE);
    expect(result.gameUsers[1]?.lifePoint).toBe(6400); // 8000 - 1600 (damage is applied later via resolver)
  });
});
