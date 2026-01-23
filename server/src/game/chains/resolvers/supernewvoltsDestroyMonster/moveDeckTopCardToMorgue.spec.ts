import { GameModel } from 'src/models/game.model';
import { GameCardModel } from 'src/models/game-card.model';
import { Zone } from 'src/graphql';
import { moveDeckTopCardToMorgue } from './moveDeckTopCardToMorgue';
import { calcNewMorgueGameCardPosition } from 'src/game/selectors/calcNewMorgueGameCardPosition';
import { handleEvent } from 'src/game/events/handlers';

// Mock dependencies
jest.mock('src/game/selectors/calcNewMorgueGameCardPosition');
jest.mock('src/game/events/handlers');

const mockCalcNewMorgueGameCardPosition = calcNewMorgueGameCardPosition as jest.MockedFunction<
  typeof calcNewMorgueGameCardPosition
>;
const mockHandleEvent = handleEvent as jest.MockedFunction<typeof handleEvent>;

describe('moveDeckTopCardToMorgue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCalcNewMorgueGameCardPosition.mockReturnValue(0);
    mockHandleEvent.mockImplementation((event, gameModel) => gameModel);
  });

  it('should move top deck card to morgue', () => {
    const topCard = new GameCardModel({
      id: 1,
      currentUserId: 'user1',
      zone: Zone.DECK,
      position: 0,
    });

    const bottomCard = new GameCardModel({
      id: 2,
      currentUserId: 'user1',
      zone: Zone.DECK,
      position: 1,
    });

    const gameModel = new GameModel({
      id: 1,
      gameCards: [bottomCard, topCard], // Order doesn't matter, position determines top
    });

    mockCalcNewMorgueGameCardPosition.mockReturnValue(5);

    const result = moveDeckTopCardToMorgue(gameModel, 'user1');

    // Check that the top card was moved to morgue
    const movedCard = result.gameCards.find(gc => gc.id === 1);
    expect(movedCard?.zone).toBe(Zone.MORGUE);
    expect(movedCard?.position).toBe(5);
    expect(movedCard?.battlePosition).toBe(null);

    // Check that the bottom card remained in deck
    const remainingCard = result.gameCards.find(gc => gc.id === 2);
    expect(remainingCard?.zone).toBe(Zone.DECK);

    // Verify position calculation was called
    expect(mockCalcNewMorgueGameCardPosition).toHaveBeenCalledWith(gameModel, 'user1');

    // Verify event was handled
    expect(mockHandleEvent).toHaveBeenCalledWith(
      {
        type: 'ZONE_CHANGED',
        gameCardId: 1,
        fromZone: Zone.DECK,
        toZone: Zone.MORGUE,
      },
      expect.any(GameModel),
    );
  });

  it('should return gameModel unchanged if deck is empty', () => {
    const gameModel = new GameModel({
      id: 1,
      gameCards: [],
    });

    const result = moveDeckTopCardToMorgue(gameModel, 'user1');

    expect(result).toBe(gameModel);
    expect(mockCalcNewMorgueGameCardPosition).not.toHaveBeenCalled();
    expect(mockHandleEvent).not.toHaveBeenCalled();
  });

  it('should return gameModel unchanged if user has no deck cards', () => {
    const otherUserCard = new GameCardModel({
      id: 1,
      currentUserId: 'user2',
      zone: Zone.DECK,
      position: 0,
    });

    const gameModel = new GameModel({
      id: 1,
      gameCards: [otherUserCard],
    });

    const result = moveDeckTopCardToMorgue(gameModel, 'user1');

    expect(result).toBe(gameModel);
    expect(mockCalcNewMorgueGameCardPosition).not.toHaveBeenCalled();
    expect(mockHandleEvent).not.toHaveBeenCalled();
  });
});
