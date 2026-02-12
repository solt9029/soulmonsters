import { BadRequestException } from '@nestjs/common';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { ActionType, Zone } from 'src/graphql/index';
import { validateUseSoulCanonAction } from './useSoulCanon';

describe('validateUseSoulCanonAction', () => {
  it('should return payload when valid cost and target are provided', () => {
    const costGameCard1 = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.SOUL,
    });
    const costGameCard2 = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.SOUL,
    });
    const costGameCard3 = new GameCardModel({
      id: 3,
      currentUserId: 'user1',
      zone: Zone.SOUL,
    });
    const costGameCard4 = new GameCardModel({
      id: 4,
      currentUserId: 'user1',
      zone: Zone.SOUL,
    });
    const targetGameCard = new GameCardModel({
      id: 5,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
    });

    const gameUser = new GameUserModel({
      userId: 'user1',
      actionTypes: [ActionType.USE_SOUL_CANON],
    });

    const gameModel = new GameModel({
      gameCards: [costGameCard1, costGameCard2, costGameCard3, costGameCard4, targetGameCard],
      gameUsers: [gameUser],
    });

    const result = validateUseSoulCanonAction(
      {
        type: ActionType.USE_SOUL_CANON,
        payload: {
          costGameCardIds: [1, 2, 3, 4],
          targetGameCardIds: [5],
        },
      },
      gameModel,
      'user1',
    );

    expect(result.costGameCards).toHaveLength(4);
    expect(result.costGameCards[0]?.id).toBe(1);
    expect(result.costGameCards[1]?.id).toBe(2);
    expect(result.costGameCards[2]?.id).toBe(3);
    expect(result.costGameCards[3]?.id).toBe(4);
    expect(result.targetGameCard.id).toBe(5);
  });

  it('should throw BadRequestException when targetGameCardIds contains duplicates', () => {
    const gameUser = new GameUserModel({
      userId: 'user1',
      actionTypes: [ActionType.USE_SOUL_CANON],
    });

    const gameModel = new GameModel({
      gameCards: [],
      gameUsers: [gameUser],
    });

    expect(() =>
      validateUseSoulCanonAction(
        {
          type: ActionType.USE_SOUL_CANON,
          payload: {
            costGameCardIds: [1, 2, 3, 3],
            targetGameCardIds: [5],
          },
        },
        gameModel,
        'user1',
      ),
    ).toThrow(BadRequestException);
  });
});
