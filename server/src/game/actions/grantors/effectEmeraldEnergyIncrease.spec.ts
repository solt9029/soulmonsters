import { grantEffectEmeraldEnergyIncreaseAction } from './effectEmeraldEnergyIncrease';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameStateModel } from 'src/models/game-state.model';
import { CardModel } from 'src/models/card.model';
import { CARD_ID } from 'src/constants/card';
import { Zone, Phase, ActionType, StateType } from 'src/graphql';

describe('grantEffectEmeraldEnergyIncreaseAction', () => {
  it('should grant EFFECT_EMERALD_ENERGY_INCREASE action when Emerald is in battle zone during SOMETHING phase', () => {
    const userId = 'user1';
    const card = new CardModel({ id: CARD_ID.MORINOMUROSAEMERARL });
    const emeraldCard = new GameCardModel({
      id: 1,
      currentUserId: userId,
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: userId,
      gameCards: [emeraldCard],
      gameUsers: [new GameUserModel({ userId, energy: 3 })],
      gameStates: [],
    });

    const result = grantEffectEmeraldEnergyIncreaseAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.EFFECT_EMERALD_ENERGY_INCREASE);
  });

  it('should not grant action when effect has already been used this turn', () => {
    const userId = 'user1';
    const card = new CardModel({ id: CARD_ID.MORINOMUROSAEMERARL });
    const emeraldCard = new GameCardModel({
      id: 1,
      currentUserId: userId,
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const existingState = new GameStateModel({
      gameCardId: 1,
      state: { type: StateType.EFFECT_EMERALD_ENERGY_INCREASE_COUNT, data: { value: 1 } },
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: userId,
      gameCards: [emeraldCard],
      gameUsers: [new GameUserModel({ userId, energy: 3 })],
      gameStates: [existingState],
    });

    const result = grantEffectEmeraldEnergyIncreaseAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_EMERALD_ENERGY_INCREASE);
  });

  it('should not grant action when not in SOMETHING phase', () => {
    const userId = 'user1';
    const card = new CardModel({ id: CARD_ID.MORINOMUROSAEMERARL });
    const emeraldCard = new GameCardModel({
      id: 1,
      currentUserId: userId,
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.BATTLE,
      turnUserId: userId,
      gameCards: [emeraldCard],
      gameUsers: [new GameUserModel({ userId, energy: 3 })],
      gameStates: [],
    });

    const result = grantEffectEmeraldEnergyIncreaseAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_EMERALD_ENERGY_INCREASE);
  });

  it('should not grant action when not user turn', () => {
    const userId = 'user1';
    const card = new CardModel({ id: CARD_ID.MORINOMUROSAEMERARL });
    const emeraldCard = new GameCardModel({
      id: 1,
      currentUserId: userId,
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user2',
      gameCards: [emeraldCard],
      gameUsers: [new GameUserModel({ userId, energy: 3 })],
      gameStates: [],
    });

    const result = grantEffectEmeraldEnergyIncreaseAction(gameModel, userId);

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_EMERALD_ENERGY_INCREASE);
  });
});
