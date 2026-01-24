import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GameCardModel } from 'src/models/game-card.model';
import { EffectType, Zone } from 'src/graphql/index';
import { resolveSoulCanon } from './soulCanon';

describe('resolveSoulCanon', () => {
  it('should move target game card to morgue zone and mark chain link as resolved', () => {
    const gameCard = new GameCardModel({
      id: 1,
      zone: Zone.BATTLE,
      currentUserId: 'user1',
      position: 0,
    });

    const gameChainLink = new GameChainLinkModel({
      id: 1,
      gameChainId: 1,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.WAITING,
      effect: {
        type: EffectType.SOUL_CANON,
        targetGameCardId: 1,
      },
    });

    const gameChain = new GameChainModel({
      id: 1,
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [gameChainLink],
    });

    const gameModel = new GameModel({
      id: 1,
      gameChains: [gameChain],
      gameCards: [gameCard],
      gameStates: [],
    });

    const result = resolveSoulCanon(gameModel, gameChainLink);

    const updatedGameCard = result.gameCards.find(gc => gc.id === 1);
    expect(updatedGameCard?.zone).toBe(Zone.MORGUE);

    const updatedChain = result.gameChains[0];
    const updatedLink = updatedChain?.gameChainLinks[0];
    expect(updatedLink?.status).toBe(GameChainLinkStatus.RESOLVED);
  });

  it('should return game model unchanged when target game card is not found', () => {
    const gameChainLink = new GameChainLinkModel({
      id: 1,
      gameChainId: 1,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.WAITING,
      effect: {
        type: EffectType.SOUL_CANON,
        targetGameCardId: 999,
      },
    });

    const gameChain = new GameChainModel({
      id: 1,
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [gameChainLink],
    });

    const gameModel = new GameModel({
      id: 1,
      gameChains: [gameChain],
      gameCards: [],
      gameStates: [],
    });

    const result = resolveSoulCanon(gameModel, gameChainLink);

    expect(result).toBe(gameModel);
  });
});
