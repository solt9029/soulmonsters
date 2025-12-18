import { GameModel } from '../../../models/game.model';
import { GameStateModel } from '../../../models/game-state.model';
import { GameUserModel } from '../../../models/game-user.model';
import { Zone, StateType, ActionType, Phase } from '../../../graphql/index';
import { grantEffectRuteRuteDrawAction } from './effectRuteruteDraw';
import { GameCardModel } from 'src/models/game-card.model';
import { CardModel } from 'src/models/card.model';

describe('grantEffectRuteRuteDrawAction', () => {
  it('should grant action when ruterute card is in battle zone and effect not used', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const ruteruteCard = new GameCardModel({
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
      gameCards: [ruteruteCard],
      gameStates: [],
    });

    const result = grantEffectRuteRuteDrawAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.EFFECT_RUTERUTE_DRAW);
  });

  it('should not grant action when effect already used for specific card', () => {
    const gameUser = new GameUserModel({ id: 1, userId: 'user1' });
    const card = new CardModel({ id: 1 });

    const ruteruteCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      card: card,
      actionTypes: [],
    });

    const existingState = new GameStateModel({
      gameCardId: ruteruteCard.id,
      state: { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } },
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser],
      gameCards: [ruteruteCard],
      gameStates: [existingState],
    });

    const result = grantEffectRuteRuteDrawAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.EFFECT_RUTERUTE_DRAW);
  });
});
