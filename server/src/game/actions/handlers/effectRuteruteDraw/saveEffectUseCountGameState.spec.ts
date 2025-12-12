import { GameModel } from 'src/models/game.model';
import { GameStateModel } from 'src/models/game-state.model';
import { GameUserModel } from 'src/models/game-user.model';
import { CardEntity } from 'src/entities/card.entity';
import { StateType, Zone } from 'src/graphql';
import { saveEffectUseCountGameState } from './saveEffectUseCountGameState';
import { GameCardModel } from 'src/models/game-card.model';

describe('saveEffectUseCountGameState', () => {
  it('should create new effect use count state when none exists', () => {
    const gameUser = new GameUserModel();
    gameUser.id = 1;
    gameUser.userId = 'user1';

    const card = new CardEntity();
    card.id = 1;

    const ruteruteCard = new GameCardModel();
    ruteruteCard.id = 1;
    ruteruteCard.currentUserId = 'user1';
    ruteruteCard.zone = Zone.BATTLE;
    ruteruteCard.card = card;

    const gameEntity = new GameModel();
    gameEntity.gameUsers = [gameUser];
    gameEntity.gameCards = [ruteruteCard];
    gameEntity.gameStates = [];

    const result = saveEffectUseCountGameState(gameEntity, ruteruteCard);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_RUTERUTE_DRAW_COUNT);
    expect(result.gameStates[0]?.gameCard?.id).toBe(1);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT) {
      expect(state.data.value).toBe(1);
    }
  });

  it('should increment existing effect use count state', () => {
    const gameUser = new GameUserModel();
    gameUser.id = 1;
    gameUser.userId = 'user1';

    const card = new CardEntity();
    card.id = 1;

    const ruteruteCard = new GameCardModel();
    ruteruteCard.id = 1;
    ruteruteCard.currentUserId = 'user1';
    ruteruteCard.zone = Zone.BATTLE;
    ruteruteCard.card = card;

    const existingState = new GameStateModel();
    existingState.gameCard = ruteruteCard;
    existingState.state = { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } };

    const gameEntity = new GameModel();
    gameEntity.gameUsers = [gameUser];
    gameEntity.gameCards = [ruteruteCard];
    gameEntity.gameStates = [existingState];

    const result = saveEffectUseCountGameState(gameEntity, ruteruteCard);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_RUTERUTE_DRAW_COUNT);
    expect(result.gameStates[0]?.gameCard?.id).toBe(1);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT) {
      expect(state.data.value).toBe(2);
    }
  });
});
