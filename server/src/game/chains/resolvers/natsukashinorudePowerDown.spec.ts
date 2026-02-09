import { GameModel } from 'src/models/game.model';
import { GameChainModel, GameChainStatus } from 'src/models/game-chain.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType, StateType } from 'src/graphql/index';
import { resolveNatsukashinorudePowerDown } from './natsukashinorudePowerDown';

describe('resolveNatsukashinorudePowerDown', () => {
  it('should create game state with target game card id and value 700', () => {
    const gameChainId = 'chain-uuid-1';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-1',
      gameChainId,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.WAITING,
      effect: {
        type: EffectType.NATSUKASHINORUDE_POWER_DOWN,
        targetGameCardId: 2,
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
      gameStates: [],
    });

    const result = resolveNatsukashinorudePowerDown(gameModel, gameChainLink);

    expect(result.gameStates).toHaveLength(1);

    const gameState = result.gameStates[0];
    expect(gameState?.gameCardId).toBe(1);
    expect(gameState?.state.type).toBe(StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN);

    if (gameState?.state.type === StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN) {
      expect(gameState.state.data.targetGameCardId).toBe(2);
      expect(gameState.state.data.value).toBe(700);
    }

    const updatedChain = result.gameChains[0];
    const updatedLink = updatedChain?.gameChainLinks[0];
    expect(updatedLink?.status).toBe(GameChainLinkStatus.RESOLVED);
  });

  it('should return unchanged model when effect type does not match', () => {
    const gameChainId = 'chain-uuid-2';
    const gameChainLink = new GameChainLinkModel({
      id: 'link-uuid-2',
      gameChainId,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.WAITING,
      effect: {
        type: EffectType.RUTERUTE_DRAW,
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
      gameStates: [],
    });

    const result = resolveNatsukashinorudePowerDown(gameModel, gameChainLink);

    expect(result.gameStates).toHaveLength(0);
    expect(result).toBe(gameModel);
  });
});
