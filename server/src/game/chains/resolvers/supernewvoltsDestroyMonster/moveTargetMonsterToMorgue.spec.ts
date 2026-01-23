import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone } from 'src/graphql';
import { moveTargetMonsterToMorgue } from './moveTargetMonsterToMorgue';
import { calcNewMorgueGameCardPosition } from 'src/game/selectors/calcNewMorgueGameCardPosition';
import { handleEvent } from 'src/game/events/handlers';

// Mock dependencies
jest.mock('src/game/selectors/calcNewMorgueGameCardPosition');
jest.mock('src/game/events/handlers');

const mockCalcNewMorgueGameCardPosition = calcNewMorgueGameCardPosition as jest.MockedFunction<
  typeof calcNewMorgueGameCardPosition
>;
const mockHandleEvent = handleEvent as jest.MockedFunction<typeof handleEvent>;

describe('moveTargetMonsterToMorgue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCalcNewMorgueGameCardPosition.mockReturnValue(0);
    mockHandleEvent.mockImplementation((event, gameModel) => gameModel);
  });

  it('should move target monster to morgue', () => {
    const targetCard = new GameCardModel({
      id: 1,
      currentUserId: 'user2',
      zone: Zone.BATTLE,
      position: 1,
      battlePosition: 'ATTACK',
    });

    const otherCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.BATTLE,
      position: 0,
    });

    const gameModel = new GameModel({
      id: 1,
      gameCards: [targetCard, otherCard],
    });

    mockCalcNewMorgueGameCardPosition.mockReturnValue(3);

    const result = moveTargetMonsterToMorgue(gameModel, targetCard);

    // Check that the target card was moved to morgue
    const movedCard = result.gameCards.find(gc => gc.id === 1);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(3);
    expect(movedCard?.battlePosition).toBe(null);

    // Check that the other card remained unchanged
    const unchangedCard = result.gameCards.find(gc => gc.id === 2);
    expect(unchangedCard?.zone).toBe(Zone.BATTLE);
    expect(unchangedCard?.position).toBe(0);

    // Verify position calculation was called with target card's owner
    expect(mockCalcNewMorgueGameCardPosition).toHaveBeenCalledWith(gameModel, 'user2');

    // Verify event was handled
    expect(mockHandleEvent).toHaveBeenCalledWith(
      {
        type: 'ZONE_CHANGED',
        gameCardId: 1,
        fromZone: Zone.BATTLE,
        toZone: Zone.MORGUE,
      },
      expect.any(GameModel),
    );
  });

  it('should handle cards from different zones', () => {
    const targetCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.HAND,
      position: 2,
    });

    const gameModel = new GameModel({
      id: 1,
      gameCards: [targetCard],
    });

    mockCalcNewMorgueGameCardPosition.mockReturnValue(1);

    const result = moveTargetMonsterToMorgue(gameModel, targetCard);

    const movedCard = result.gameCards.find(gc => gc.id === 1);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(1);

    // Verify event shows correct fromZone
    expect(mockHandleEvent).toHaveBeenCalledWith(
      {
        type: 'ZONE_CHANGED',
        gameCardId: 1,
        fromZone: Zone.HAND,
        toZone: Zone.MORGUE,
      },
      expect.any(GameModel),
    );
  });
});
