import { GameModel } from 'src/models/game.model';
import { GameStateEntity } from 'src/entities/game-state.entity';
import { StateType } from 'src/graphql';
import { savePutCountGameState } from './savePutCountGameState';

describe('savePutCountGameState', () => {
  it('should create new PUT_SOUL_COUNT state when none exists', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameStates: [],
    });

    const result = savePutCountGameState(gameEntity, 1);
    const state = result.gameStates[0]?.state;

    expect(result.gameStates).toHaveLength(1);
    expect(state?.type).toBe(StateType.PUT_SOUL_COUNT);

    if (state?.type === StateType.PUT_SOUL_COUNT) {
      expect(state.data.gameUserId).toBe(1);
      expect(state.data.value).toBe(1);
    }
  });

  it('should increment existing PUT_SOUL_COUNT state value', () => {
    const gameEntity = new GameModel({
      id: 1,
      gameStates: [
        new GameStateEntity({
          state: {
            type: StateType.PUT_SOUL_COUNT,
            data: { gameUserId: 1, value: 2 },
          },
        }),
      ],
    });

    const result = savePutCountGameState(gameEntity, 1);
    const state = result.gameStates[0]?.state;

    expect(result.gameStates).toHaveLength(1);
    expect(state?.type).toBe(StateType.PUT_SOUL_COUNT);

    if (state?.type === StateType.PUT_SOUL_COUNT) {
      expect(state.data.gameUserId).toBe(1);
      expect(state.data.value).toBe(3);
    }
  });
});
