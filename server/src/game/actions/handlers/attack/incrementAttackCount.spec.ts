import { GameCardEntity } from '../../../../entities/game.card.entity';
import { GameEntity } from '../../../../entities/game.entity';
import { GameStateEntity } from '../../../../entities/game.state.entity';
import { Zone, StateType } from '../../../../graphql';
import { incrementAttackCount } from './incrementAttackCount';

describe('incrementAttackCount', () => {
  it('should create new ATTACK_COUNT state when none exists', () => {
    const gameCard = new GameCardEntity({
      id: 1,
      zone: Zone.BATTLE,
    });

    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [gameCard],
      gameStates: [],
    });

    const result = incrementAttackCount(gameEntity, 1);
    const state = result.gameStates[0]?.state;

    expect(result.gameStates).toHaveLength(1);
    expect(state?.type).toBe(StateType.ATTACK_COUNT);

    if (state?.type === StateType.ATTACK_COUNT) {
      expect(state.data.value).toBe(1);
    }
  });

  it('should increment existing ATTACK_COUNT state value', () => {
    const gameCard = new GameCardEntity({
      id: 1,
      zone: Zone.BATTLE,
    });

    const gameEntity = new GameEntity({
      id: 1,
      gameCards: [gameCard],
      gameStates: [
        new GameStateEntity({
          gameCard,
          state: {
            type: StateType.ATTACK_COUNT,
            data: { value: 2 },
          },
        }),
      ],
    });

    const result = incrementAttackCount(gameEntity, 1);
    const state = result.gameStates[0]?.state;

    expect(result.gameStates).toHaveLength(1);
    expect(state?.type).toBe(StateType.ATTACK_COUNT);

    if (state?.type === StateType.ATTACK_COUNT) {
      expect(state.data.value).toBe(3);
    }
  });
});
