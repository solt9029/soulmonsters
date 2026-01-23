import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameCardModel } from 'src/models/game-card.model';
import { EffectType, Zone } from 'src/graphql/index';
import { GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { handleEffectNatsukashinorudePowerDown } from './effectNatsukashinorudePowerDown';

describe('handleEffectNatsukashinorudePowerDown', () => {
  it('should consume 2 energy and create a game chain with a chain link', () => {
    const gameUser = new GameUserModel({
      id: 1,
      userId: 'user1',
      energy: 5,
    });

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
      gameUsers: [gameUser],
      gameCards: [gameCard, targetGameCard],
      gameChains: [],
    });

    const result = handleEffectNatsukashinorudePowerDown(
      'user1',
      {
        gameCard,
        targetGameCard,
      },
      gameModel,
    );

    const updatedUser = result.gameUsers.find(u => u.userId === 'user1');
    expect(updatedUser?.energy).toBe(3);

    expect(result.gameChains).toHaveLength(1);

    const gameChain = result.gameChains[0];
    expect(gameChain?.status).toBe(GameChainStatus.RESOLVING);
    expect(gameChain?.gameChainLinks).toHaveLength(1);

    const chainLink = gameChain?.gameChainLinks[0];
    expect(chainLink?.orderIndex).toBe(0);
    expect(chainLink?.userId).toBe('user1');
    expect(chainLink?.gameCardId).toBe(1);
    expect(chainLink?.status).toBe(GameChainLinkStatus.WAITING);
    expect(chainLink?.effect.type).toBe(EffectType.NATSUKASHINORUDE_POWER_DOWN);

    if (chainLink?.effect.type === EffectType.NATSUKASHINORUDE_POWER_DOWN) {
      expect(chainLink.effect.targetGameCardId).toBe(2);
    }
  });
});
