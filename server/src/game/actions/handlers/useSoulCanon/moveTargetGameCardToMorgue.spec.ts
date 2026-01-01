import { Zone, BattlePosition } from 'src/graphql';
import { moveTargetGameCardToMorgue } from './moveTargetGameCardToMorgue';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';

describe('moveTargetGameCardToMorgue', () => {
  it('should move target game card from battle zone to morgue zone', () => {
    const targetGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.ATTACK,
    });

    const gameEntity = new GameModel({
      id: 1,
      gameCards: [targetGameCard],
    });

    const result = moveTargetGameCardToMorgue(gameEntity, targetGameCard);

    expect(result.gameCards[0]?.zone).toBe(Zone.MORGUE);
    expect(result.gameCards[0]?.battlePosition).toBe(null);
    expect(result.gameCards[0]?.position).toBe(0);
  });
});
