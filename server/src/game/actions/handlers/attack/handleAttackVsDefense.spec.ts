import { GameCardEntity } from '../../../../entities/game-card.entity';
import { GameEntity } from '../../../../entities/game.entity';
import { GameUserEntity } from '../../../../entities/game-user.entity';
import { Zone } from '../../../../graphql';
import { handleAttackVsDefense } from './handleAttackVsDefense';

describe('handleAttackVsDefense', () => {
  it('should destroy defender when attacker attack is higher than defender defence', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [
        new GameCardEntity({
          id: 1,
          currentUserId: 'user1',
          attack: 2000,
          zone: Zone.BATTLE,
        }),
        new GameCardEntity({
          id: 2,
          currentUserId: 'user2',
          defence: 1500,
          zone: Zone.BATTLE,
        }),
      ],
    });

    const result = handleAttackVsDefense(gameEntity, 1, 2);

    expect(result.gameCards[1]?.zone).toBe(Zone.SOUL);
  });

  it('should deal damage to attacker when defence is higher than attack', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          lifePoint: 8000,
        }),
      ],
      gameCards: [
        new GameCardEntity({
          id: 1,
          currentUserId: 'user1',
          attack: 1500,
          zone: Zone.BATTLE,
        }),
        new GameCardEntity({
          id: 2,
          currentUserId: 'user2',
          defence: 2000,
          zone: Zone.BATTLE,
        }),
      ],
    });

    const result = handleAttackVsDefense(gameEntity, 1, 2);

    expect(result.gameUsers[0]?.lifePoint).toBe(7500);
  });
});
