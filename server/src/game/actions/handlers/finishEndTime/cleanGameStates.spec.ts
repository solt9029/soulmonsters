import { GameEntity } from 'src/entities/game.entity';
import { GameStateEntity } from 'src/entities/game.state.entity';
import { GameUserEntity } from 'src/entities/game.user.entity';
import { GameCardEntity } from 'src/entities/game.card.entity';
import { StateType } from 'src/graphql';
import { cleanGameStates } from './cleanGameStates';

describe('cleanGameStates', () => {
  it('should throw error when game user not found', () => {
    const gameEntity = new GameEntity({
      gameUsers: [],
      gameStates: [],
    });

    expect(() => cleanGameStates(gameEntity, 'user1')).toThrow('Game user not found');
  });

  it('should remove ATTACK_COUNT and PUT_SOUL_COUNT states for specified user', () => {
    const gameUser = new GameUserEntity({
      id: 1,
      userId: 'user1',
    });

    const gameCard = new GameCardEntity({
      currentUserId: 'user1',
    });

    const gameEntity = new GameEntity({
      gameUsers: [gameUser],
      gameStates: [
        new GameStateEntity({
          state: {
            type: StateType.ATTACK_COUNT,
            data: { value: 1 },
          },
          gameCard: gameCard,
        }),
        new GameStateEntity({
          state: {
            type: StateType.PUT_SOUL_COUNT,
            data: { gameUserId: 1, value: 2 },
          },
        }),
        new GameStateEntity({
          state: {
            type: StateType.SELF_POWER_CHANGE,
            data: { attack: 100, defence: 200 },
          },
        }),
      ],
    });

    const result = cleanGameStates(gameEntity, 'user1');

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.SELF_POWER_CHANGE);
  });

  it('should keep states that do not match filter conditions', () => {
    const gameUser1 = new GameUserEntity({
      id: 1,
      userId: 'user1',
    });

    const gameUser2 = new GameUserEntity({
      id: 2,
      userId: 'user2',
    });

    const gameCard = new GameCardEntity({
      currentUserId: 'user2',
    });

    const gameEntity = new GameEntity({
      gameUsers: [gameUser1, gameUser2],
      gameStates: [
        new GameStateEntity({
          state: {
            type: StateType.ATTACK_COUNT,
            data: { value: 1 },
          },
          gameCard: gameCard,
        }),
        new GameStateEntity({
          state: {
            type: StateType.PUT_SOUL_COUNT,
            data: { gameUserId: 2, value: 2 },
          },
        }),
      ],
    });

    const result = cleanGameStates(gameEntity, 'user1');

    expect(result.gameStates).toHaveLength(2);
  });
});
