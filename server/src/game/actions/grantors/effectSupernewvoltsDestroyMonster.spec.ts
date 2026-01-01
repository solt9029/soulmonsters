import { GameModel } from '../../../models/game.model';
import { GameStateModel } from '../../../models/game-state.model';
import { GameUserModel } from '../../../models/game-user.model';
import { Zone, StateType, ActionType, Phase } from '../../../graphql/index';
import { grantEffectSupernewvoltsDestroyMonsterAction } from './effectSupernewvoltsDestroyMonster';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';
import { CARD_ID } from 'src/constants/card';

describe('grantEffectSupernewvoltsDestroyMonsterAction', () => {
  it('should grant action when supernewvolts is in battle zone, has cards in deck, and effect not used', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsCard = new CardModel({ id: CARD_ID.SUPERNEWVOLTS });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: supernewvoltsCard,
      actionTypes: [],
    });

    const deckCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.DECK,
      card: new CardModel({ id: 999 }),
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard, deckCard],
      gameStates: [],
    });

    const result = grantEffectSupernewvoltsDestroyMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER);
  });

  it('should not grant action when effect already used', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsCard = new CardModel({ id: CARD_ID.SUPERNEWVOLTS });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: supernewvoltsCard,
      actionTypes: [],
    });

    const deckCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.DECK,
      card: new CardModel({ id: 999 }),
      actionTypes: [],
    });

    const existingState = new GameStateModel({
      gameCardId: supernewvoltsGameCard.id,
      state: { type: StateType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER_COUNT, data: { value: 1 } },
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard, deckCard],
      gameStates: [existingState],
    });

    const result = grantEffectSupernewvoltsDestroyMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER);
  });

  it('should not grant action when no cards in deck', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsCard = new CardModel({ id: CARD_ID.SUPERNEWVOLTS });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: supernewvoltsCard,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard],
      gameStates: [],
    });

    const result = grantEffectSupernewvoltsDestroyMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER);
  });

  it('should not grant action when not in SOMETHING phase', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsCard = new CardModel({ id: CARD_ID.SUPERNEWVOLTS });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: supernewvoltsCard,
      actionTypes: [],
    });

    const deckCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.DECK,
      card: new CardModel({ id: 999 }),
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.DRAW,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard, deckCard],
      gameStates: [],
    });

    const result = grantEffectSupernewvoltsDestroyMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER);
  });

  it('should not grant action when not user turn', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const supernewvoltsCard = new CardModel({ id: CARD_ID.SUPERNEWVOLTS });

    const supernewvoltsGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: supernewvoltsCard,
      actionTypes: [],
    });

    const deckCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.DECK,
      card: new CardModel({ id: 999 }),
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user2',
      gameUsers: [gameUser],
      gameCards: [supernewvoltsGameCard, deckCard],
      gameStates: [],
    });

    const result = grantEffectSupernewvoltsDestroyMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_SUPERNEWVOLTS_DESTROY_MONSTER);
  });
});
