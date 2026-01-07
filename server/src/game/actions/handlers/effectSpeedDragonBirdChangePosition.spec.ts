import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { BattlePosition, Zone } from 'src/graphql/index';
import { handleEffectSpeedDragonBirdChangePosition } from './effectSpeedDragonBirdChangePosition';

describe('handleEffectSpeedDragonBirdChangePosition', () => {
  it('should move cost cards to morgue and change ATTACK position to DEFENCE', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
    });

    const costGameCard1 = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 0,
    });

    const costGameCard2 = new GameCardModel({
      id: 3,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 1,
    });

    const costGameCard3 = new GameCardModel({
      id: 4,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 2,
    });

    const targetGameCard = new GameCardModel({
      id: 5,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      battlePosition: BattlePosition.ATTACK,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard, costGameCard1, costGameCard2, costGameCard3, targetGameCard],
    });

    const result = handleEffectSpeedDragonBirdChangePosition(
      'user1',
      {
        gameCard,
        costGameCards: [costGameCard1, costGameCard2, costGameCard3],
        targetGameCard,
      },
      gameModel,
    );

    const movedCard1 = result.gameCards.find(gc => gc.id === 2);
    const movedCard2 = result.gameCards.find(gc => gc.id === 3);
    const movedCard3 = result.gameCards.find(gc => gc.id === 4);

    expect(movedCard1?.zone).toBe(Zone.MORGUE);
    expect(movedCard2?.zone).toBe(Zone.MORGUE);
    expect(movedCard3?.zone).toBe(Zone.MORGUE);

    const changedTarget = result.gameCards.find(gc => gc.id === 5);
    expect(changedTarget?.battlePosition).toBe(BattlePosition.DEFENCE);
  });

  it('should move cost cards to morgue and change DEFENCE position to ATTACK', () => {
    const gameCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
    });

    const costGameCard1 = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 0,
    });

    const costGameCard2 = new GameCardModel({
      id: 3,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 1,
    });

    const costGameCard3 = new GameCardModel({
      id: 4,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 2,
    });

    const targetGameCard = new GameCardModel({
      id: 5,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      battlePosition: BattlePosition.DEFENCE,
    });

    const gameModel = new GameModel({
      gameCards: [gameCard, costGameCard1, costGameCard2, costGameCard3, targetGameCard],
    });

    const result = handleEffectSpeedDragonBirdChangePosition(
      'user1',
      {
        gameCard,
        costGameCards: [costGameCard1, costGameCard2, costGameCard3],
        targetGameCard,
      },
      gameModel,
    );

    const movedCard1 = result.gameCards.find(gc => gc.id === 2);
    const movedCard2 = result.gameCards.find(gc => gc.id === 3);
    const movedCard3 = result.gameCards.find(gc => gc.id === 4);

    expect(movedCard1?.zone).toBe(Zone.MORGUE);
    expect(movedCard2?.zone).toBe(Zone.MORGUE);
    expect(movedCard3?.zone).toBe(Zone.MORGUE);

    const changedTarget = result.gameCards.find(gc => gc.id === 5);
    expect(changedTarget?.battlePosition).toBe(BattlePosition.ATTACK);
  });
});
