import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone, ActionType, Phase } from 'src/graphql/index';
import { grantChangeBattlePositionAction } from './changeBattlePosition';

describe('grantChangeBattlePositionAction', () => {
  it('should grant action during SOMETHING phase for turn player with battle zone gameCard', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameCards: [gameCard],
    });

    const result = grantChangeBattlePositionAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.CHANGE_BATTLE_POSITION);
  });

  it('should not grant action when phase is not SOMETHING', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.BATTLE,
      turnUserId: 'user1',
      gameCards: [gameCard],
    });

    const result = grantChangeBattlePositionAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.CHANGE_BATTLE_POSITION);
  });

  it('should not grant action when user is not turn player', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user2',
      gameCards: [gameCard],
    });

    const result = grantChangeBattlePositionAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.CHANGE_BATTLE_POSITION);
  });

  it('should not grant action when gameCard is not in BATTLE zone', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameCards: [gameCard],
    });

    const result = grantChangeBattlePositionAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.CHANGE_BATTLE_POSITION);
  });

  it('should not grant action to opponent gameCards', () => {
    const myGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      actionTypes: [],
    });

    const opponentGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameCards: [myGameCard, opponentGameCard],
    });

    const result = grantChangeBattlePositionAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.CHANGE_BATTLE_POSITION);
    expect(result.gameCards[1]?.actionTypes).not.toContain(ActionType.CHANGE_BATTLE_POSITION);
  });
});
