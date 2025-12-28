import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone, ActionType, Phase, Kind } from 'src/graphql/index';
import { grantSummonMonsterAction } from './summonMonster';

describe('grantSummonMonsterAction', () => {
  it('should grant action during SOMETHING phase for turn player with MONSTER in HAND zone', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      kind: Kind.MONSTER,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameCards: [gameCard],
    });

    const result = grantSummonMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.SUMMON_MONSTER);
  });

  it('should not grant action when phase is not SOMETHING', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      kind: Kind.MONSTER,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.BATTLE,
      turnUserId: 'user1',
      gameCards: [gameCard],
    });

    const result = grantSummonMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.SUMMON_MONSTER);
  });

  it('should not grant action when user is not turn player', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      kind: Kind.MONSTER,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user2',
      gameCards: [gameCard],
    });

    const result = grantSummonMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.SUMMON_MONSTER);
  });

  it('should not grant action when gameCard is not in HAND zone', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      kind: Kind.MONSTER,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameCards: [gameCard],
    });

    const result = grantSummonMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.SUMMON_MONSTER);
  });

  it('should not grant action to opponent gameCards', () => {
    const myGameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      kind: Kind.MONSTER,
      actionTypes: [],
    });

    const opponentGameCard = new GameCardModel({
      id: 2,
      currentUserId: 'user2',
      zone: Zone.HAND,
      kind: Kind.MONSTER,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameCards: [myGameCard, opponentGameCard],
    });

    const result = grantSummonMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.SUMMON_MONSTER);
    expect(result.gameCards[1]?.actionTypes).not.toContain(ActionType.SUMMON_MONSTER);
  });

  it('should not grant action when card kind is not MONSTER', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      kind: Kind.QUICK,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameCards: [gameCard],
    });

    const result = grantSummonMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).not.toContain(ActionType.SUMMON_MONSTER);
  });

  it('should grant action to multiple MONSTER cards in HAND', () => {
    const gameCard1 = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      kind: Kind.MONSTER,
      actionTypes: [],
    });

    const gameCard2 = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.HAND,
      kind: Kind.MONSTER,
      actionTypes: [],
    });

    const gameModel = new GameModel({
      phase: Phase.SOMETHING,
      turnUserId: 'user1',
      gameCards: [gameCard1, gameCard2],
    });

    const result = grantSummonMonsterAction(gameModel, 'user1');

    expect(result.gameCards[0]?.actionTypes).toContain(ActionType.SUMMON_MONSTER);
    expect(result.gameCards[1]?.actionTypes).toContain(ActionType.SUMMON_MONSTER);
  });
});
