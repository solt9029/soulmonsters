import { GameCardEntity } from '../../../../entities/game-card.entity';
import { GameModel } from '../../../../models/game.model';
import { GameUserEntity } from '../../../../entities/game-user.entity';
import { Zone } from '../../../../graphql';
import { handleAttackVsAttack } from './handleAttackVsAttack';

describe('handleAttackVsAttack', () => {
  it('should destroy defender when attacker wins', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          lifePoint: 8000,
          energy: 5,
        }),
        new GameUserEntity({
          userId: 'user2',
          lifePoint: 8000,
          energy: 5,
        }),
      ],
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
          attack: 1500,
          zone: Zone.BATTLE,
        }),
      ],
    });

    const result = handleAttackVsAttack(gameEntity, 1, 2);

    expect(result.gameCards[1]?.zone).toBe(Zone.SOUL);
    expect(result.gameUsers[1]?.lifePoint).toBe(7500);
    expect(result.gameUsers[1]?.energy).toBe(6);
  });

  it('should destroy both monsters when attack values are equal', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameUsers: [
        new GameUserEntity({
          userId: 'user1',
          energy: 5,
        }),
        new GameUserEntity({
          userId: 'user2',
          energy: 5,
        }),
      ],
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
          attack: 2000,
          zone: Zone.BATTLE,
        }),
      ],
    });

    const result = handleAttackVsAttack(gameEntity, 1, 2);

    expect(result.gameCards[0]?.zone).toBe(Zone.SOUL);
    expect(result.gameCards[1]?.zone).toBe(Zone.SOUL);
    expect(result.gameUsers[0]?.energy).toBe(6);
    expect(result.gameUsers[1]?.energy).toBe(6);
  });
});
