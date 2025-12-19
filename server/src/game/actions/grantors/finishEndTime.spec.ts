import { GameModel } from '../../../models/game.model';
import { GameUserModel } from '../../../models/game-user.model';
import { Phase, ActionType } from '../../../graphql/index';
import { grantFinishEndTimeAction } from './finishEndTime';

describe('grantFinishEndTimeAction', () => {
  it('should grant FINISH_END_TIME action when phase is END and user is turn user', () => {
    const gameUser1 = new GameUserModel({ id: 1, userId: 'user1', actionTypes: [] });
    const gameUser2 = new GameUserModel({ id: 2, userId: 'user2', actionTypes: [] });

    const gameModel = new GameModel({
      phase: Phase.END,
      turnUserId: 'user1',
      gameUsers: [gameUser1, gameUser2],
      gameCards: [],
      gameStates: [],
    });

    const result = grantFinishEndTimeAction(gameModel, 'user1');

    const resultUser1 = result.gameUsers.find(u => u.userId === 'user1');
    const resultUser2 = result.gameUsers.find(u => u.userId === 'user2');

    expect(resultUser1?.actionTypes).toContain(ActionType.FINISH_END_TIME);
    expect(resultUser2?.actionTypes).not.toContain(ActionType.FINISH_END_TIME);
  });

  it('should not grant action when phase is not END', () => {
    const gameUser1 = new GameUserModel({ id: 1, userId: 'user1', actionTypes: [] });
    const gameUser2 = new GameUserModel({ id: 2, userId: 'user2', actionTypes: [] });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameUsers: [gameUser1, gameUser2],
      gameCards: [],
      gameStates: [],
    });

    const result = grantFinishEndTimeAction(gameModel, 'user1');

    expect(result.gameUsers[0]?.actionTypes).not.toContain(ActionType.FINISH_END_TIME);
    expect(result.gameUsers[1]?.actionTypes).not.toContain(ActionType.FINISH_END_TIME);
  });
});
