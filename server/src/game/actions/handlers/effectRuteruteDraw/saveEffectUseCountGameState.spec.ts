import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game.state.entity';
import { StateType } from 'src/graphql';
import { saveEffectUseCountGameState } from './saveEffectUseCountGameState';

describe('saveEffectUseCountGameState', () => {
  it('should create new effect use count state when none exists', () => {
    const gameEntity = new GameEntity();
    gameEntity.gameStates = [];

    const result = saveEffectUseCountGameState(gameEntity, 'RUTERUTE_DRAW', 1);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_RUTERUTE_DRAW_COUNT);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT) {
      expect(state.data.gameUserId).toBe(1);
      expect(state.data.value).toBe(1);
    }
  });

  it('should increment existing effect use count state', () => {
    const gameEntity = new GameEntity();
    gameEntity.gameStates = [
      new GameStateEntity({
        game: gameEntity,
        state: {
          type: StateType.EFFECT_RUTERUTE_DRAW_COUNT,
          data: { gameUserId: 1, value: 1 },
        },
      }),
    ];

    const result = saveEffectUseCountGameState(gameEntity, 'RUTERUTE_DRAW', 1);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.EFFECT_RUTERUTE_DRAW_COUNT);

    const state = result.gameStates[0]?.state;
    if (state?.type === StateType.EFFECT_RUTERUTE_DRAW_COUNT) {
      expect(state.data.gameUserId).toBe(1);
      expect(state.data.value).toBe(2);
    }
  });
});
