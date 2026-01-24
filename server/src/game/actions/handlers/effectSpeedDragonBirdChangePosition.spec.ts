import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { BattlePosition, EffectType, Zone } from 'src/graphql/index';
import { GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { handleEffectSpeedDragonBirdChangePosition } from './effectSpeedDragonBirdChangePosition';

describe('handleEffectSpeedDragonBirdChangePosition', () => {
  it('should move cost cards to morgue and create game chain with chain link', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
    });

    const costGameCard1 = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 0,
    });

    const costGameCard2 = new GameCardModel({
      id: 3,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 1,
    });

    const costGameCard3 = new GameCardModel({
      id: 4,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 2,
    });

    const targetGameCard = new GameCardModel({
      id: 5,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      battlePosition: BattlePosition.ATTACK,
    });

    const gameModel = new GameModel({
      id: 1,
      gameCards: [gameCard, costGameCard1, costGameCard2, costGameCard3, targetGameCard],
      gameChains: [],
    });

    const result = handleEffectSpeedDragonBirdChangePosition(
      'user1',
      {
        gameCard,
        costGameCards: [costGameCard1, costGameCard2, costGameCard3],
        targetGameCard,
      },
      gameModel,
    );

    const movedCard1 = result.gameCards.find(gc => gc.id === 2);
    const movedCard2 = result.gameCards.find(gc => gc.id === 3);
    const movedCard3 = result.gameCards.find(gc => gc.id === 4);

    expect(movedCard1?.zone).toBe(Zone.MORGUE);
    expect(movedCard2?.zone).toBe(Zone.MORGUE);
    expect(movedCard3?.zone).toBe(Zone.MORGUE);

    expect(result.gameChains).toHaveLength(1);

    const gameChain = result.gameChains[0];
    expect(gameChain?.status).toBe(GameChainStatus.RESOLVING);
    expect(gameChain?.gameChainLinks).toHaveLength(1);

    const chainLink = gameChain?.gameChainLinks[0];
    expect(chainLink?.orderIndex).toBe(0);
    expect(chainLink?.userId).toBe('user1');
    expect(chainLink?.gameCardId).toBe(1);
    expect(chainLink?.status).toBe(GameChainLinkStatus.WAITING);
    expect(chainLink?.effect.type).toBe(EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION);

    if (chainLink?.effect.type === EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION) {
      expect(chainLink.effect.targetGameCardId).toBe(5);
    }
  });
});
