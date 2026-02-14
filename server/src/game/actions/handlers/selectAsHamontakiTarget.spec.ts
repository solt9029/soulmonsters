import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { handleSelectAsHamontakiTarget } from './selectAsHamontakiTarget';

describe('handleSelectAsHamontakiTarget', () => {
  it('should set selectedGameCardId in resolving chain link effect', () => {
    const userId = 'user1';
    const targetGameCard = new GameCardModel({
      id: 2,
    });

    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId,
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.HAMONTAKI_SPECIAL_SUMMON,
        selectedGameCardId: undefined,
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
    });

    const result = handleSelectAsHamontakiTarget(userId, { targetGameCard }, gameModel);

    const updatedChain = result.gameChains[0];
    const updatedLink = updatedChain?.gameChainLinks[0];
    expect(updatedLink?.effect.type).toBe(EffectType.HAMONTAKI_SPECIAL_SUMMON);

    if (updatedLink?.effect.type === EffectType.HAMONTAKI_SPECIAL_SUMMON) {
      expect(updatedLink.effect.selectedGameCardId).toBe(2);
    }
  });

  it('should throw error when no resolving game chain exists', () => {
    const userId = 'user1';
    const targetGameCard = new GameCardModel({
      id: 2,
    });

    const gameModel = new GameModel({
      id: 1,
      gameChains: [],
    });

    expect(() => handleSelectAsHamontakiTarget(userId, { targetGameCard }, gameModel)).toThrow(
      'No resolving game chain found',
    );
  });
});
