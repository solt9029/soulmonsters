import { CardEntity } from '../../../../entities/card.entity';
import { GameCardEntity } from '../../../../entities/game.card.entity';
import { GameEntity } from '../../../../entities/game.entity';
import { GameUserEntity } from '../../../../entities/game.user.entity';
import { directAttack } from './directAttack';

describe('directAttack', () => {
  it('should deal damage to opponent player based on attacker card attack', () => {
    const gameEntity = new GameEntity({
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
});
