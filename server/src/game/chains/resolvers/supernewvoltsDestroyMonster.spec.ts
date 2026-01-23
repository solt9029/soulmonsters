import { GameModel } from 'src/models/game.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { GameStateModel } from 'src/models/game-state.model';
import { CardModel } from 'src/models/card.model';
import { Zone, EffectType, StateType, BattlePosition } from 'src/graphql/index';
import { resolveSupernewvoltsDestroyMonster } from './supernewvoltsDestroyMonster';

describe('resolveSupernewvoltsDestroyMonster', () => {
  it('should move deck top card to morgue, target monster to morgue, save effect count, and mark chain link as resolved', () => {
    const gameUser1 = new GameUserModel({ id: 1, userId: 'user1' });
    const gameUser2 = new GameUserModel({ id: 2, userId: 'user2' });
    
    const supernewvoltsCard = new CardModel({ id: 1 });
    const deckCard = new CardModel({ id: 2 });
    const targetCard = new CardModel({ id: 3 });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      position: 0,
      card: supernewvoltsCard,
    });

    const deckTopCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.DECK,
      position: 0,
      card: deckCard,
    });

    const targetGameCard = new GameCardModel({
      id: 3,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.ATTACK,
      card: targetCard,
    });

    const gameChainLink = new GameChainLinkModel({
      id: 'link1',
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER,
        payload: {
          gameCard: supernewvoltsGameCard,
          targetGameCard: targetGameCard,
        },
      },
    });

    const gameModel = new GameModel({
      id: 'game1',
      gameUsers: [gameUser1, gameUser2],
      gameCards: [supernewvoltsGameCard, deckTopCard, targetGameCard],
      gameStates: [],
      gameChainLinks: [gameChainLink],
    });

    const result = resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);

    // Verify deck top card moved to morgue
    const movedDeckCard = result.gameCards.find(gc => gc.id === 2);
    expect(movedDeckCard?.zone).toBe(Zone.MORGUE);
    expect(movedDeckCard?.position).toBe(0);
    expect(movedDeckCard?.battlePosition).toBe(null);

    // Verify target monster moved to morgue
    const movedTargetCard = result.gameCards.find(gc => gc.id === 3);
    expect(movedTargetCard?.zone).toBe(Zone.MORGUE);
    expect(movedTargetCard?.position).toBe(1);
    expect(movedTargetCard?.battlePosition).toBe(null);

    // Verify effect use count GameState saved
    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.gameCardId).toBe(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT) {
      expect(state.data.value).toBe(1);
    }

    // Verify game chain link marked as resolved
    const resolvedLink = result.gameChainLinks.find(gcl => gcl.id === 'link1');
    expect(resolvedLink?.status).toBe(GameChainLinkStatus.RESOLVED);
  });

  it('should return unchanged model when gameCard is not found', () => {
    const gameChainLink = new GameChainLinkModel({
      id: 'link1',
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 999, // non-existent gameCard
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER,
        payload: {
          gameCard: new GameCardModel({ id: 1 }),
          targetGameCard: new GameCardModel({ id: 2 }),
        },
      },
    });

    const gameModel = new GameModel({
      id: 'game1',
      gameUsers: [],
      gameCards: [],
      gameStates: [],
      gameChainLinks: [gameChainLink],
    });

    const result = resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);

    expect(result).toBe(gameModel);
  });

  it('should return unchanged model when payload is missing', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
    });

    const gameChainLink = new GameChainLinkModel({
      id: 'link1',
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
      id: 'game1',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard],
      gameStates: [],
      gameChainLinks: [gameChainLink],
    });

    const result = resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);

    expect(result).toBe(gameModel);
  });

  it('should return unchanged model when targetGameCard is missing from payload', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
    });

    const gameChainLink = new GameChainLinkModel({
      id: 'link1',
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER,
        payload: {
          gameCard: supernewvoltsGameCard,
          targetGameCard: null,
        },
      },
    });

    const gameModel = new GameModel({
      id: 'game1',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard],
      gameStates: [],
      gameChainLinks: [gameChainLink],
    });

    const result = resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);

    expect(result).toBe(gameModel);
  });

  it('should handle case when no deck cards exist', () => {
    const gameUser1 = new GameUserModel({ id: 1, userId: 'user1' });
    const gameUser2 = new GameUserModel({ id: 2, userId: 'user2' });
    
    const supernewvoltsCard = new CardModel({ id: 1 });
    const targetCard = new CardModel({ id: 3 });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      position: 0,
      card: supernewvoltsCard,
    });

    const targetGameCard = new GameCardModel({
      id: 3,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.ATTACK,
      card: targetCard,
    });

    const gameChainLink = new GameChainLinkModel({
      id: 'link1',
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER,
        payload: {
          gameCard: supernewvoltsGameCard,
          targetGameCard: targetGameCard,
        },
      },
    });

    const gameModel = new GameModel({
      id: 'game1',
      gameUsers: [gameUser1, gameUser2],
      gameCards: [supernewvoltsGameCard, targetGameCard], // No deck cards
      gameStates: [],
      gameChainLinks: [gameChainLink],
    });

    const result = resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);

    // Verify target monster still moved to morgue
    const movedTargetCard = result.gameCards.find(gc => gc.id === 3);
    expect(movedTargetCard?.zone).toBe(Zone.MORGUE);

    // Verify effect use count GameState saved
    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT);

    // Verify game chain link marked as resolved
    const resolvedLink = result.gameChainLinks.find(gcl => gcl.id === 'link1');
    expect(resolvedLink?.status).toBe(GameChainLinkStatus.RESOLVED);
  });

  it('should increment existing effect use count', () => {
    const gameUser1 = new GameUserModel({ id: 1, userId: 'user1' });
    const gameUser2 = new GameUserModel({ id: 2, userId: 'user2' });
    
    const supernewvoltsCard = new CardModel({ id: 1 });
    const targetCard = new CardModel({ id: 3 });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      position: 0,
      card: supernewvoltsCard,
    });

    const targetGameCard = new GameCardModel({
      id: 3,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      position: 0,
      battlePosition: BattlePosition.ATTACK,
      card: targetCard,
    });

    // Existing effect use count state
    const existingState = new GameStateModel({
      gameCardId: 1,
      state: { type: StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT, data: { value: 1 } },
    });

    const gameChainLink = new GameChainLinkModel({
      id: 'link1',
      orderIndex: 0,
      userId: 'user1',
      gameCardId: 1,
      status: GameChainLinkStatus.RESOLVING,
      effect: {
        type: EffectType.SUPERNEWVOLTS_DESTROY_MONSTER,
        payload: {
          gameCard: supernewvoltsGameCard,
          targetGameCard: targetGameCard,
        },
      },
    });

    const gameModel = new GameModel({
      id: 'game1',
      gameUsers: [gameUser1, gameUser2],
      gameCards: [supernewvoltsGameCard, targetGameCard],
      gameStates: [existingState],
      gameChainLinks: [gameChainLink],
    });

    const result = resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);

    // Verify effect use count incremented
    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.gameCardId).toBe(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT) {
      expect(state.data.value).toBe(2);
    }
  });
});