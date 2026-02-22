import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { GameUserModel } from 'src/models/game-user.model';
import { ActionType, Zone } from 'src/graphql/index';
import { GameActionGrantor } from './index';

describe('GameActionGrantor - clearNonExclusiveActions', () => {
  let gameActionGrantor: GameActionGrantor;

  beforeEach(() => {
    gameActionGrantor = new GameActionGrantor();
  });

  describe('exclusive action bug reproduction', () => {
    it('should clear non-exclusive actions from users when exclusive actions exist on cards', () => {
      // Setup: User has START_END_TIME action, GameCard has exclusive SELECT_AS_HAMONTAKI_TARGET action
      const gameCard = new GameCardModel({
        id: 1,
        currentUserId: 'user1',
        zone: Zone.MORGUE,
        actionTypes: [ActionType.SELECT_AS_HAMONTAKI_TARGET], // exclusive action
      });

      const gameUser = new GameUserModel({
        userId: 'user1',
        actionTypes: [ActionType.START_END_TIME], // non-exclusive action
      });

      const gameModel = new GameModel({
        id: 1,
        endedAt: null,
        gameCards: [gameCard],
        gameUsers: [gameUser],
      });

      // This simulates the bug scenario where clearNonExclusiveActions doesn't clear user actions
      // when exclusive actions exist only on cards, not on users
      const result = gameActionGrantor.grantActions(gameModel, 'user1');

      // BUG: Currently, the user still has START_END_TIME action even though exclusive actions exist
      // EXPECTED: User should only have exclusive actions or no actions at all
      const resultUser = result.gameUsers.find(gu => gu.userId === 'user1');

      // This assertion will fail with the current bug, showing the issue
      expect(resultUser?.actionTypes).not.toContain(ActionType.START_END_TIME);
    });

    it('should clear non-exclusive actions from users when exclusive actions exist on other users', () => {
      // Setup: User1 has START_END_TIME, User2 has exclusive action
      const gameUser1 = new GameUserModel({
        userId: 'user1',
        actionTypes: [ActionType.START_END_TIME], // non-exclusive action
      });

      const gameUser2 = new GameUserModel({
        userId: 'user2',
        actionTypes: [ActionType.SELECT_AS_HAMONTAKI_TARGET], // exclusive action
      });

      const gameModel = new GameModel({
        id: 1,
        endedAt: null,
        gameCards: [],
        gameUsers: [gameUser1, gameUser2],
      });

      const result = gameActionGrantor.grantActions(gameModel, 'user1');

      // User1 should not have START_END_TIME when exclusive actions exist anywhere
      const resultUser1 = result.gameUsers.find(gu => gu.userId === 'user1');
      expect(resultUser1?.actionTypes).not.toContain(ActionType.START_END_TIME);

      // User2 should keep exclusive action
      const resultUser2 = result.gameUsers.find(gu => gu.userId === 'user2');
      expect(resultUser2?.actionTypes).toContain(ActionType.SELECT_AS_HAMONTAKI_TARGET);
    });
  });
});
