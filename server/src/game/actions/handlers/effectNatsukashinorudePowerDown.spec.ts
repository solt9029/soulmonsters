import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { StateType } from 'src/graphql/index';
import { handleEffectNatsukashinorudePowerDown } from './effectNatsukashinorudePowerDown';

describe('handleEffectNatsukashinorudePowerDown', () => {
  it('should subtract 2 energy and create EFFECT_NATSUKASHINORUDE_POWER_DOWN and EFFECT_NATSUKASHINORUDE_USE_COUNT states', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
    });

    const targetGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
    });

    const gameUser = new GameUserModel({
      userId: 'user1',
      energy: 5,
    });

    const gameModel = new GameModel({
      gameUsers: [gameUser],
      gameCards: [gameCard, targetGameCard],
      gameStates: [],
    });

    const result = handleEffectNatsukashinorudePowerDown('user1', { gameCard, targetGameCard }, gameModel);

    expect(result.gameUsers[0]?.energy).toBe(3);
    expect(result.gameStates).toHaveLength(2);

    const powerDownState = result.gameStates[0]?.state;
    expect(powerDownState?.type).toBe(StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN);

    if (powerDownState?.type === StateType.EFFECT_NATSUKASHINORUDE_POWER_DOWN) {
      expect(powerDownState.data.targetGameCardId).toBe(2);
      expect(powerDownState.data.value).toBe(700);
    }

    const useCountState = result.gameStates[1]?.state;
    expect(useCountState?.type).toBe(StateType.EFFECT_NATSUKASHINORUDE_USE_COUNT);

    if (useCountState?.type === StateType.EFFECT_NATSUKASHINORUDE_USE_COUNT) {
      expect(useCountState.data.value).toBe(1);
    }
  });
});
