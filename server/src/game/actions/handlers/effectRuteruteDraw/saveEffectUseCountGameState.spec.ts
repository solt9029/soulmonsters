import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game.state.entity';
import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameUserEntity } from 'src/entities/game.user.entity';
import { CardEntity } from 'src/entities/card.entity';
import { StateType, Zone } from 'src/graphql';
import { saveEffectUseCountGameState } from './saveEffectUseCountGameState';

describe('saveEffectUseCountGameState', () => {
  it('should create new effect use count state when none exists', () => {
    const gameUser = new GameUserEntity();
    gameUser.id = 1;
    gameUser.userId = 'user1';

    const card = new CardEntity();
    card.id = 1;

    const ruteruteCard = new GameCardEntity();
    ruteruteCard.id = 1;
    ruteruteCard.currentUserId = 'user1';
    ruteruteCard.zone = Zone.BATTLE;
    ruteruteCard.card = card;

    const gameEntity = new GameEntity();
    gameEntity.gameUsers = [gameUser];
    gameEntity.gameCards = [ruteruteCard];
    gameEntity.gameStates = [];

    const result = saveEffectUseCountGameState(gameEntity, 1);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_RUTERUTE_DRAW_COUNT);
    expect(result.gameStates[0]?.gameCard?.id).toBe(1);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT) {
      expect(state.data.value).toBe(1);
    }
  });

  it('should increment existing effect use count state', () => {
    const gameUser = new GameUserEntity();
    gameUser.id = 1;
    gameUser.userId = 'user1';

    const card = new CardEntity();
    card.id = 1;

    const ruteruteCard = new GameCardEntity();
    ruteruteCard.id = 1;
    ruteruteCard.currentUserId = 'user1';
    ruteruteCard.zone = Zone.BATTLE;
    ruteruteCard.card = card;

    const existingState = new GameStateEntity();
    existingState.gameCard = ruteruteCard;
    existingState.state = { type: StateType.EFFECT_RUTERUTE_DRAW_COUNT, data: { value: 1 } };

    const gameEntity = new GameEntity();
    gameEntity.gameUsers = [gameUser];
    gameEntity.gameCards = [ruteruteCard];
    gameEntity.gameStates = [existingState];

    const result = saveEffectUseCountGameState(gameEntity, 1);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_RUTERUTE_DRAW_COUNT);
    expect(result.gameStates[0]?.gameCard?.id).toBe(1);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT) {
      expect(state.data.value).toBe(2);
    }
  });
});
