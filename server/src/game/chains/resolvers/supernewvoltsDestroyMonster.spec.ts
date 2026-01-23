import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType, Zone, StateType } from 'src/graphql/index';
import { resolveSupernewvoltsDestroyMonster } from './supernewvoltsDestroyMonster';

// Mock the helper functions
jest.mock('./supernewvoltsDestroyMonster/moveDeckTopCardToMorgue');
jest.mock('./supernewvoltsDestroyMonster/moveTargetMonsterToMorgue');
jest.mock('./supernewvoltsDestroyMonster/saveEffectUseCountGameState');
jest.mock('src/game/mutations/markGameChainLinkAsResolved');

import { moveDeckTopCardToMorgue } from './supernewvoltsDestroyMonster/moveDeckTopCardToMorgue';
import { moveTargetMonsterToMorgue } from './supernewvoltsDestroyMonster/moveTargetMonsterToMorgue';
import { saveEffectUseCountGameState } from './supernewvoltsDestroyMonster/saveEffectUseCountGameState';
import { markGameChainLinkAsResolved } from 'src/game/mutations/markGameChainLinkAsResolved';

const mockMoveDeckTopCardToMorgue = moveDeckTopCardToMorgue as jest.MockedFunction<typeof moveDeckTopCardToMorgue>;
const mockMoveTargetMonsterToMorgue = moveTargetMonsterToMorgue as jest.MockedFunction<
  typeof moveTargetMonsterToMorgue
>;
const mockSaveEffectUseCountGameState = saveEffectUseCountGameState as jest.MockedFunction<
  typeof saveEffectUseCountGameState
>;
const mockMarkGameChainLinkAsResolved = markGameChainLinkAsResolved as jest.MockedFunction<
  typeof markGameChainLinkAsResolved
>;

describe('resolveSupernewvoltsDestroyMonster', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    mockMoveDeckTopCardToMorgue.mockImplementation(gameModel => gameModel);
    mockMoveTargetMonsterToMorgue.mockImplementation(gameModel => gameModel);
    mockSaveEffectUseCountGameState.mockImplementation(gameModel => gameModel);
    mockMarkGameChainLinkAsResolved.mockImplementation(gameModel => gameModel);
  });

  it('should execute all effect steps and mark chain link as resolved', () => {
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

    const gameChainLink = new GameChainLinkModel({
      id: 1,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER,
        payload: {
          gameCard,
          targetGameCard,
        },
      },
    });

    const gameModel = new GameModel({
      id: 1,
      gameUsers: [],
      gameCards: [gameCard, targetGameCard],
      gameChains: [],
    });

    const result = resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);

    // Verify all effect steps are called in correct order
    expect(mockMoveDeckTopCardToMorgue).toHaveBeenCalledWith(gameModel, 'user1');
    expect(mockMoveTargetMonsterToMorgue).toHaveBeenCalledWith(gameModel, targetGameCard);
    expect(mockSaveEffectUseCountGameState).toHaveBeenCalledWith(gameModel, gameCard);
    expect(mockMarkGameChainLinkAsResolved).toHaveBeenCalledWith(gameModel, gameChainLink);

    expect(result).toBe(gameModel);
  });

  it('should return gameModel unchanged if payload is missing', () => {
    const gameChainLink = new GameChainLinkModel({
      id: 1,
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER,
        payload: null,
      },
    });

    const gameModel = new GameModel({
      id: 1,
      gameUsers: [],
      gameCards: [],
      gameChains: [],
    });

    const result = resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);

    // No functions should be called if payload is missing
    expect(mockMoveDeckTopCardToMorgue).not.toHaveBeenCalled();
    expect(mockMoveTargetMonsterToMorgue).not.toHaveBeenCalled();
    expect(mockSaveEffectUseCountGameState).not.toHaveBeenCalled();
    expect(mockMarkGameChainLinkAsResolved).not.toHaveBeenCalled();

    expect(result).toBe(gameModel);
  });
});
