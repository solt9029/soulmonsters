import { GameModel } from 'src/models/game.model';
import { GameStateModel } from 'src/models/game-state.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';
import { StateType, Zone } from 'src/graphql/index';
import { saveEffectUseCountGameState } from './saveEffectUseCountGameState';

describe('saveEffectUseCountGameState', () => {
  it('should create new effect use count state when none exists', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const supernewvoltsCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [supernewvoltsCard],
      gameStates: [],
    });

    const result = saveEffectUseCountGameState(gameModel, supernewvoltsCard);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT);
    expect(result.gameStates[0]?.gameCardId).toBe(1);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT) {
      expect(state.data.value).toBe(1);
    }
  });

  it('should increment existing effect use count state', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const supernewvoltsCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
    });

    const existingState = new GameStateModel({
      gameCardId: supernewvoltsCard.id,
      state: { type: StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT, data: { value: 1 } },
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [supernewvoltsCard],
      gameStates: [existingState],
    });

    const result = saveEffectUseCountGameState(gameModel, supernewvoltsCard);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT);
    expect(result.gameStates[0]?.gameCardId).toBe(1);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT) {
      expect(state.data.value).toBe(2);
    }
  });

  it('should handle multiple increments correctly', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const supernewvoltsCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
    });

    const existingState = new GameStateModel({
      gameCardId: supernewvoltsCard.id,
      state: { type: StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT, data: { value: 3 } },
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [supernewvoltsCard],
      gameStates: [existingState],
    });

    const result = saveEffectUseCountGameState(gameModel, supernewvoltsCard);

    expect(result.gameStates).toHaveLength(1);
    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT) {
      expect(state.data.value).toBe(4);
    }
  });

  it('should only affect states for specific gameCard', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card1 = new CardModel({ id: 1 });
    const card2 = new CardModel({ id: 2 });

    const supernewvoltsCard1 = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card1,
    });

    const supernewvoltsCard2 = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card2,
    });

    const existingState1 = new GameStateModel({
      gameCardId: 1,
      state: { type: StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT, data: { value: 1 } },
    });

    const existingState2 = new GameStateModel({
      gameCardId: 2,
      state: { type: StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT, data: { value: 2 } },
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [supernewvoltsCard1, supernewvoltsCard2],
      gameStates: [existingState1, existingState2],
    });

    const result = saveEffectUseCountGameState(gameModel, supernewvoltsCard1);

    expect(result.gameStates).toHaveLength(2);
    
    const card1State = result.gameStates.find(gs => gs.gameCardId === 1)?.state;
    if (card1State?.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT) {
      expect(card1State.data.value).toBe(2); // Incremented
    }

    const card2State = result.gameStates.find(gs => gs.gameCardId === 2)?.state;
    if (card2State?.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT) {
      expect(card2State.data.value).toBe(2); // Unchanged
    }
  });

  it('should preserve other GameStates when creating new effect count state', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const supernewvoltsCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
    });

    const otherState = new GameStateModel({
      gameCardId: 1,
      state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } },
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [supernewvoltsCard],
      gameStates: [otherState],
    });

    const result = saveEffectUseCountGameState(gameModel, supernewvoltsCard);

    expect(result.gameStates).toHaveLength(2);
    expect(result.gameStates.some(gs => gs.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT)).toBe(true);
    expect(result.gameStates.some(gs => gs.state.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT)).toBe(true);
  });

  it('should preserve other GameStates when incrementing existing effect count state', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const supernewvoltsCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
    });

    const existingEffectState = new GameStateModel({
      gameCardId: 1,
      state: { type: StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT, data: { value: 1 } },
    });

    const otherState = new GameStateModel({
      gameCardId: 1,
      state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 2 } },
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [supernewvoltsCard],
      gameStates: [existingEffectState, otherState],
    });

    const result = saveEffectUseCountGameState(gameModel, supernewvoltsCard);

    expect(result.gameStates).toHaveLength(2);
    
    const effectState = result.gameStates.find(gs => gs.state.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT)?.state;
    if (effectState?.type === StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT) {
      expect(effectState.data.value).toBe(2); // Incremented
    }

    const otherStateResult = result.gameStates.find(gs => gs.state.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT)?.state;
    if (otherStateResult?.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT) {
      expect(otherStateResult.data.value).toBe(2); // Unchanged
    }
  });
});