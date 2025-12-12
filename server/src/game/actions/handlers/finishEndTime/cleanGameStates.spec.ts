import { GameModel } from 'src/models/game.model';
import { GameStateModel } from 'src/models/game-state.model';
import { GameUserModel } from 'src/models/game-user.model';
import { GameCardEntity } from 'src/entities/game-card.entity';
import { StateType } from 'src/graphql';
import { cleanGameStates } from './cleanGameStates';

describe('cleanGameStates', () => {
  it('should remove ATTACK_COUNT and PUT_SOUL_COUNT states for specified user', () => {
    const gameUser = new GameUserModel({
      id: 1,
      userId: 'user1',
    });

    const gameCard = new GameCardEntity({
      currentUserId: 'user1',
    });

    const gameEntity = new GameModel({
      gameUsers: [gameUser],
      gameStates: [
        new GameStateModel({
          state: {
            type: StateType.ATTACK_COUNT,
            data: { value: 1 },
          },
          gameCard: gameCard,
        }),
        new GameStateModel({
          state: {
            type: StateType.PUT_SOUL_COUNT,
            data: { gameUserId: 1, value: 2 },
          },
        }),
        new GameStateModel({
          state: {
            type: StateType.SELF_POWER_CHANGE,
            data: { attack: 100, defence: 200 },
          },
        }),
      ],
    });

    const result = cleanGameStates(gameEntity, gameUser);

    expect(result.gameStates).toHaveLength(1);
    expect(result.gameStates[0]?.state.type).toBe(StateType.SELF_POWER_CHANGE);
  });

  it('should keep states that do not match filter conditions', () => {
    const gameUser1 = new GameUserModel({
      id: 1,
      userId: 'user1',
    });

    const gameUser2 = new GameUserModel({
      id: 2,
      userId: 'user2',
    });

    const gameCard = new GameCardEntity({
      currentUserId: 'user2',
    });

    const gameEntity = new GameModel({
      gameUsers: [gameUser1, gameUser2],
      gameStates: [
        new GameStateModel({
          state: {
            type: StateType.ATTACK_COUNT,
            data: { value: 1 },
          },
          gameCard: gameCard,
        }),
        new GameStateModel({
          state: {
            type: StateType.PUT_SOUL_COUNT,
            data: { gameUserId: 2, value: 2 },
          },
        }),
      ],
    });

    const result = cleanGameStates(gameEntity, gameUser1);

    expect(result.gameStates).toHaveLength(2);
  });
});
