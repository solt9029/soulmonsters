import { ChainBuilder } from 'src/game/chains/builders/index';
import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GamePendingEffectModel } from 'src/models/game-pending-effect.model';
import { EffectType } from 'src/graphql/index';

describe('ChainBuilder.buildChain', () => {
  let chainBuilder: ChainBuilder;

  beforeEach(() => {
    chainBuilder = new ChainBuilder();
  });

  it('should return unchanged model when gamePendingEffects is empty', () => {
    const gameModel = new GameModel({
      id: 1,
      turnUserId: 'user1',
      gameChains: [],
      gamePendingEffects: [],
    });

    const result = chainBuilder.buildChain(gameModel);

    expect(result).toBe(gameModel);
    expect(result.gameChains).toHaveLength(0);
  });

  it('should return unchanged model when a RESOLVING chain exists', () => {
    const existingChain = new GameChainModel({
      id: 'chain-uuid-1',
      gameId: 1,
      status: GameChainStatus.RESOLVING,
      gameChainLinks: [],
    });

    const pendingEffect = new GamePendingEffectModel({
      id: 1,
      gameId: 1,
      userId: 'user1',
      gameCardId: 1,
      effectType: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER,
    });

    const gameModel = new GameModel({
      id: 1,
      turnUserId: 'user1',
      gameChains: [existingChain],
      gamePendingEffects: [pendingEffect],
    });

    const result = chainBuilder.buildChain(gameModel);

    expect(result).toBe(gameModel);
    expect(result.gameChains).toHaveLength(1);
    expect(result.gamePendingEffects).toHaveLength(1);
  });

  it('should create a chain with a single link when gamePendingEffects has one entry', () => {
    const pendingEffect = new GamePendingEffectModel({
      id: 1,
      gameId: 1,
      userId: 'user1',
      gameCardId: 1,
      effectType: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER,
    });

    const gameModel = new GameModel({
      id: 1,
      turnUserId: 'user1',
      gameChains: [],
      gamePendingEffects: [pendingEffect],
    });

    const result = chainBuilder.buildChain(gameModel);

    expect(result.gameChains).toHaveLength(1);

    const gameChain = result.gameChains[0];
    expect(gameChain?.status).toBe(GameChainStatus.RESOLVING);
    expect(gameChain?.gameChainLinks).toHaveLength(1);

    const gameChainLink = gameChain?.gameChainLinks[0];
    expect(gameChainLink?.status).toBe(GameChainLinkStatus.WAITING);
    expect(gameChainLink?.userId).toBe('user1');
    expect(gameChainLink?.gameCardId).toBe(1);
    expect(gameChainLink?.effect.type).toBe(EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER);
  });

  it('should register all pending effects as links in a single chain', () => {
    const pendingEffect1 = new GamePendingEffectModel({
      id: 1,
      gameId: 1,
      userId: 'user1',
      gameCardId: 1,
      effectType: EffectType.SHINKASHITABAKUBOMDAN_DAMAGE,
    });

    const pendingEffect2 = new GamePendingEffectModel({
      id: 2,
      gameId: 1,
      userId: 'user2',
      gameCardId: 2,
      effectType: EffectType.SHINKASHITABAKUBOMDAN_DAMAGE,
    });

    const gameModel = new GameModel({
      id: 1,
      turnUserId: 'user1',
      gameChains: [],
      gamePendingEffects: [pendingEffect1, pendingEffect2],
    });

    const result = chainBuilder.buildChain(gameModel);

    expect(result.gameChains).toHaveLength(1);

    const gameChain = result.gameChains[0];
    expect(gameChain?.gameChainLinks).toHaveLength(2);

    const chainId = gameChain?.id;
    expect(gameChain?.gameChainLinks[0]?.gameChainId).toBe(chainId);
    expect(gameChain?.gameChainLinks[1]?.gameChainId).toBe(chainId);
  });

  it('should assign orderIndex 0 to the turn player effect (chainLink 1)', () => {
    const turnPlayerEffect = new GamePendingEffectModel({
      id: 1,
      gameId: 1,
      userId: 'user1',
      gameCardId: 1,
      effectType: EffectType.SHINKASHITABAKUBOMDAN_DAMAGE,
    });

    const opponentEffect = new GamePendingEffectModel({
      id: 2,
      gameId: 1,
      userId: 'user2',
      gameCardId: 2,
      effectType: EffectType.SHINKASHITABAKUBOMDAN_DAMAGE,
    });

    const gameModel = new GameModel({
      id: 1,
      turnUserId: 'user1',
      gameChains: [],
      gamePendingEffects: [turnPlayerEffect, opponentEffect],
    });

    const result = chainBuilder.buildChain(gameModel);

    const gameChainLinks = result.gameChains[0]?.gameChainLinks ?? [];
    const turnPlayerLink = gameChainLinks.find(link => link.userId === 'user1');
    const opponentLink = gameChainLinks.find(link => link.userId === 'user2');

    // ターンプレイヤーはチェーンリンク1（orderIndex: 0）
    // ChainResolverはorderIndex降順で処理するため、チェーンリンク2（相手）が先に解決される
    expect(turnPlayerLink?.orderIndex).toBe(0);
    expect(opponentLink?.orderIndex).toBe(1);
  });

  it('should clear gamePendingEffects after building a chain', () => {
    const pendingEffect = new GamePendingEffectModel({
      id: 1,
      gameId: 1,
      userId: 'user1',
      gameCardId: 1,
      effectType: EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER,
    });

    const gameModel = new GameModel({
      id: 1,
      turnUserId: 'user1',
      gameChains: [],
      gamePendingEffects: [pendingEffect],
    });

    const result = chainBuilder.buildChain(gameModel);

    expect(result.gamePendingEffects).toHaveLength(0);
  });
});
