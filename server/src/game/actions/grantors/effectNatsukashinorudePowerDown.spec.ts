import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameStateModel } from 'src/models/game-state.model';
import { CardModel } from 'src/models/card.model';
import { Zone, StateType, ActionType, Phase } from 'src/graphql/index';
import { CARD_ID } from 'src/constants/card';
import { grantEffectNatsukashinorudePowerDownAction } from './effectNatsukashinorudePowerDown';

describe('grantEffectNatsukashinorudePowerDownAction', () => {
  it('should grant action when natsukashinorude card is in battle zone during SOMETHING phase for turn player', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: CARD_ID.NATSUKASHINORUDE });

    const natsukashinorudeCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [natsukashinorudeCard],
      gameStates: [],
    });

    const result = grantEffectNatsukashinorudePowerDownAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN);
  });

  it('should not grant action when phase is not SOMETHING', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: CARD_ID.NATSUKASHINORUDE });

    const natsukashinorudeCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.BATTLE,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [natsukashinorudeCard],
      gameStates: [],
    });

    const result = grantEffectNatsukashinorudePowerDownAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN);
  });

  it('should not grant action when user is not turn player', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: CARD_ID.NATSUKASHINORUDE });

    const natsukashinorudeCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user2',
      gameUsers: [gameUser],
      gameCards: [natsukashinorudeCard],
      gameStates: [],
    });

    const result = grantEffectNatsukashinorudePowerDownAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN);
  });

  it('should not grant action when card is not in BATTLE zone', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: CARD_ID.NATSUKASHINORUDE });

    const natsukashinorudeCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      card: card,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [natsukashinorudeCard],
      gameStates: [],
    });

    const result = grantEffectNatsukashinorudePowerDownAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN);
  });

  it('should not grant action when effect already used', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: CARD_ID.NATSUKASHINORUDE });

    const natsukashinorudeCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const existingState = new GameStateModel({
      gameCardId: natsukashinorudeCard.id,
      state: { type: StateType.EFFECT_NATSUKASHINORUDE_USE_COUNT, data: { value: 1 } },
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [natsukashinorudeCard],
      gameStates: [existingState],
    });

    const result = grantEffectNatsukashinorudePowerDownAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN);
  });
});
