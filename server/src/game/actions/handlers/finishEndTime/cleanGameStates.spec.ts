import { GameModel } from 'src/models/game.model';
import { GameStateModel } from 'src/models/game-state.model';
import { GameUserModel } from 'src/models/game-user.model';
import { StateType } from 'src/graphql';
import { cleanGameStates } from './cleanGameStates';
import { GameCardModel } from 'src/models/game-card.model';

describe('cleanGameStates', () => {
  it('should remove ATTACK_COUNT and PUT_SOUL_COUNT states for specified user', () => {
    const gameUser = new GameUserModel({
      id: 1,
      userId: 'user1',
    });

    const gameCard = new GameCardModel({
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
          gameCardId: gameCard.id,
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
});
