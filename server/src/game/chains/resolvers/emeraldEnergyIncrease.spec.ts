import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GameUserModel } from 'src/models/game-user.model';
import { EffectType } from 'src/graphql/index';
import { resolveEmeraldEnergyIncrease } from './emeraldEnergyIncrease';

describe('resolveEmeraldEnergyIncrease', () => {
  it('should increase energy by 1 and mark chain link as resolved', () => {
    const gameUser = new GameUserModel({
      id: 1,
      userId: 'user1',
      energy: 3,
      lifePoint: 8000,
    });

    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.WAITING,
      effect: {
        type: EffectType.EMERALD_ENERGY_INCREASE,
      },
    });

    const gameChain = new GameChainModel({
      id: gameChainId,
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [gameChainLink],
    });

    const gameModel = new GameModel({
      id: 1,
      gameChains: [gameChain],
      gameUsers: [gameUser],
      gameStates: [],
    });

    const result = resolveEmeraldEnergyIncrease(gameModel, gameChainLink);

    const updatedGameUser = result.gameUsers.find(u => u.userId === 'user1');
    expect(updatedGameUser?.energy).toBe(4);

    const updatedChain = result.gameChains[0];
    const updatedLink = updatedChain?.gameChainLinks[0];
    expect(updatedLink?.status).toBe(GameChainLinkStatus.RESOLVED);
  });
});
