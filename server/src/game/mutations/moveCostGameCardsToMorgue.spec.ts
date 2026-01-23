import { Zone } from 'src/graphql';
import { moveCostGameCardsToMorgue } from 'src/game/mutations/moveCostGameCardsToMorgue';
import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';

describe('moveCostGameCardsToMorgue', () => {
  it('should move cost game cards from soul zone to morgue zone', () => {
    const costGameCard1 = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 0,
    });

    const costGameCard2 = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.SOUL,
      position: 1,
    });

    const gameEntity = new GameModel({
      id: 1,
      gameCards: [costGameCard1, costGameCard2],
    });

    const result = moveCostGameCardsToMorgue(gameEntity, 'user1', [costGameCard1, costGameCard2]);

    const movedCard1 = result.gameCards.find(gc => gc.id === 1);
    const movedCard2 = result.gameCards.find(gc => gc.id === 2);

    expect(movedCard1?.zone).toBe(Zone.MORGUE);
    expect(movedCard1?.position).toBe(0);
    expect(movedCard1?.battlePosition).toBe(null);

    expect(movedCard2?.zone).toBe(Zone.MORGUE);
    expect(movedCard2?.position).toBe(1);
    expect(movedCard2?.battlePosition).toBe(null);
  });
});
