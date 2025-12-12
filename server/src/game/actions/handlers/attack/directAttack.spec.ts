import { CardEntity } from '../../../../entities/card.entity';
import { GameCardEntity } from '../../../../entities/game-card.entity';
import { GameModel } from '../../../../models/game.model';
import { GameUserEntity } from '../../../../entities/game-user.entity';
import { Zone } from '../../../../graphql';
import { directAttack } from './directAttack';

describe('directAttack', () => {
  it('should deal damage to opponent player based on attacker card attack', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          lifePoint: 8000,
        }),
        new GameUserEntity({
          userId: 'user2',
          lifePoint: 8000,
        }),
      ],
      gameCards: [
        new GameCardEntity({
          id: 1,
          attack: 1500,
          card: new CardEntity({
            id: 1,
          }),
        }),
      ],
    });

    const result = directAttack(gameEntity, 1, 'user2');

    expect(result.gameUsers[1]?.lifePoint).toBe(6500);
  });

  it('should draw 2 cards when card ID 11 (冷徹な鳥) performs direct attack', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          lifePoint: 8000,
        }),
        new GameUserEntity({
          userId: 'user2',
          lifePoint: 8000,
        }),
      ],
      gameCards: [
        new GameCardEntity({
          id: 1,
          attack: 600,
          currentUserId: 'user1',
          card: new CardEntity({
            id: 11,
          }),
        }),
        new GameCardEntity({
          id: 2,
          zone: Zone.DECK,
          position: 1,
          currentUserId: 'user1',
          card: new CardEntity({
            id: 2,
          }),
        }),
        new GameCardEntity({
          id: 3,
          zone: Zone.DECK,
          position: 0,
          currentUserId: 'user1',
          card: new CardEntity({
            id: 3,
          }),
        }),
      ],
    });

    const result = directAttack(gameEntity, 1, 'user2');

    const handCards = result.gameCards.filter(card => card.zone === Zone.HAND && card.currentUserId === 'user1');
    expect(handCards).toHaveLength(2);
    expect(result.gameUsers[1]?.lifePoint).toBe(7400);
  });
});
