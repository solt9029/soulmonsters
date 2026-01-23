import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { EffectType, Zone } from 'src/graphql/index';
import { GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { handleEffectSupernewvoltsDestroyMonster } from './effectSupernewvoltsDestroyMonster';

describe('handleEffectSupernewvoltsDestroyMonster', () => {
  it('should create a game chain with a chain link for SUPERNEWVOLTS_DESTROY_MONSTER effect', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
    });

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
    });

    const gameModel = new GameModel({
      id: 1,
      gameUsers: [],
      gameCards: [gameCard, targetGameCard],
      gameChains: [],
    });

    const result = handleEffectSupernewvoltsDestroyMonster(
      'user1',
      {
        gameCard,
        targetGameCard,
      },
      gameModel,
    );

    expect(result.gameChains).toHaveLength(1);

    const gameChain = result.gameChains[0];
    expect(gameChain?.status).toBe(GameChainStatus.RESOLVING);
    expect(gameChain?.gameChainLinks).toHaveLength(1);

    const chainLink = gameChain?.gameChainLinks[0];
    expect(chainLink?.orderIndex).toBe(0);
    expect(chainLink?.userId).toBe('user1');
    expect(chainLink?.gameCardId).toBe(1);
    expect(chainLink?.status).toBe(GameChainLinkStatus.WAITING);
    expect(chainLink?.effect.type).toBe(EffectType.SUPERNEWVOLTS_DESTROY_MONSTER);

    if (chainLink?.effect.type === EffectType.SUPERNEWVOLTS_DESTROY_MONSTER) {
      expect(chainLink.effect.payload).toEqual({
        gameCard,
        targetGameCard,
      });
    }
  });

  it('should not consume any energy (effect has no cost)', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
    });

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
    });

    const gameModel = new GameModel({
      id: 1,
      gameUsers: [],
      gameCards: [gameCard, targetGameCard],
      gameChains: [],
    });

    const result = handleEffectSupernewvoltsDestroyMonster(
      'user1',
      {
        gameCard,
        targetGameCard,
      },
      gameModel,
    );

    // Energy should remain unchanged (no cost processing)
    expect(result.gameUsers).toEqual(gameModel.gameUsers);
  });
});
