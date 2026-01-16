import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql';
import { markGameChainLinkAsResolved } from './markGameChainLinkAsResolved';

describe('markGameChainLinkAsResolved', () => {
  it('should mark target gameChainLink as resolved while gameChain remains resolving when other links are waiting', () => {
    const gameModel = new GameModel();

    const targetLink = new GameChainLinkModel({
      id: 2,
      gameChainId: 1,
      orderIndex: 1,
      userId: 'user2',
      gameCardId: 2,
      status: GameChainLinkStatus.RESOLVING,
      effect: { type: EffectType.RUTERUTE_DRAW },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const gameChain = new GameChainModel({
      id: 1,
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [
        new GameChainLinkModel({
          id: 1,
          gameChainId: 1,
          orderIndex: 0,
          userId: 'user1',
          gameCardId: 1,
          status: GameChainLinkStatus.WAITING,
          effect: { type: EffectType.RUTERUTE_DRAW },
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        targetLink,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    gameModel.gameChains = [gameChain];

    const result = markGameChainLinkAsResolved(gameModel, gameChain, targetLink);

    const updatedChain = result.gameChains.find(chain => chain.id === 1);
    expect(updatedChain?.status).toBe(GameChainStatus.RESOLVING);

    const updatedLink = updatedChain?.gameChainLinks.find(link => link.id === 2);
    expect(updatedLink?.status).toBe(GameChainLinkStatus.RESOLVED);

    const waitingLink = updatedChain?.gameChainLinks.find(link => link.id === 1);
    expect(waitingLink?.status).toBe(GameChainLinkStatus.WAITING);
  });

  it('should mark gameChain as resolved when target gameChainLink becomes resolved and all links are resolved', () => {
    const gameModel = new GameModel();

    const targetLink = new GameChainLinkModel({
      id: 1,
      gameChainId: 1,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: { type: EffectType.RUTERUTE_DRAW },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const gameChain = new GameChainModel({
      id: 1,
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [
        targetLink,
        new GameChainLinkModel({
          id: 2,
          gameChainId: 1,
          orderIndex: 1,
          userId: 'user2',
          gameCardId: 2,
          status: GameChainLinkStatus.RESOLVED,
          effect: { type: EffectType.RUTERUTE_DRAW },
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    gameModel.gameChains = [gameChain];

    const result = markGameChainLinkAsResolved(gameModel, gameChain, targetLink);

    const updatedChain = result.gameChains.find(chain => chain.id === 1);
    expect(updatedChain?.status).toBe(GameChainStatus.RESOLVED);

    const resolvedTargetLink = updatedChain?.gameChainLinks.find(link => link.id === 1);
    expect(resolvedTargetLink?.status).toBe(GameChainLinkStatus.RESOLVED);

    const alreadyResolvedLink = updatedChain?.gameChainLinks.find(link => link.id === 2);
    expect(alreadyResolvedLink?.status).toBe(GameChainLinkStatus.RESOLVED);
  });
});
