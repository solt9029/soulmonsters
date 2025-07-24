import { GameCardEntity } from '../../../../entities/game.card.entity';
import { GameEntity } from '../../../../entities/game.entity';
import { BattlePosition, Zone } from '../../../../graphql';
import { summonGameCard } from './summonGameCard';

describe('summonGameCard', () => {
  it('should move card from hand to battle zone in attack position', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [
        new GameCardEntity({
          id: 1,
          currentUserId: 'user1',
          zone: Zone.HAND,
          position: 0,
        }),
      ],
    });

    const result = summonGameCard(gameEntity, 'user1', 1);

    expect(result.gameCards[0]?.zone).toBe(Zone.BATTLE);
    expect(result.gameCards[0]?.battlePosition).toBe(BattlePosition.ATTACK);
    expect(result.gameCards[0]?.position).toBe(0);
  });

  it('should calculate correct position when other battle cards exist', () => {
    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [
        new GameCardEntity({
          id: 1,
          currentUserId: 'user1',
          zone: Zone.BATTLE,
          position: 0,
        }),
        new GameCardEntity({
          id: 2,
          currentUserId: 'user1',
          zone: Zone.BATTLE,
          position: 1,
        }),
        new GameCardEntity({
          id: 3,
          currentUserId: 'user1',
          zone: Zone.HAND,
          position: 0,
        }),
      ],
    });

    const result = summonGameCard(gameEntity, 'user1', 3);

    expect(result.gameCards[2]?.zone).toBe(Zone.BATTLE);
    expect(result.gameCards[2]?.position).toBe(2);
  });
});
