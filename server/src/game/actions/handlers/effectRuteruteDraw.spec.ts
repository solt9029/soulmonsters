import { GameEntity } from 'src/entities/game.entity';
import { GameUserEntity } from 'src/entities/game.user.entity';
import { GameCardEntity } from 'src/entities/game.card.entity';
import { Zone } from 'src/graphql';
import { handleEffectRuteruteDraw } from './effectRuteruteDraw';
import { EntityManager } from 'typeorm';

jest.mock('typeorm', () => ({
  EntityManager: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('handleEffectRuteruteDraw', () => {
  let mockManager: jest.Mocked<EntityManager>;

  beforeEach(() => {
    mockManager = {
      save: jest.fn().mockResolvedValue(undefined),
    } as any;
  });

  it('should draw card and save effect use count', async () => {
    const gameUser = new GameUserEntity();
    gameUser.id = 1;
    gameUser.userId = 'user1';

    const gameEntity = new GameEntity();
    gameEntity.gameUsers = [gameUser];
    gameEntity.gameCards = [
      new GameCardEntity({
        id: 1,
        zone: Zone.DECK,
        position: 5,
        currentUserId: 'user1',
        originalUserId: 'user1',
        name: 'Test Card',
      }),
    ];
    gameEntity.gameStates = [];

    await handleEffectRuteruteDraw(mockManager, 'user1', {} as any, gameEntity);

    const drawnCard = gameEntity.gameCards.find(card => card.id === 1);
    expect(drawnCard?.zone).toBe(Zone.HAND);
    expect(gameEntity.gameStates).toHaveLength(1);
    expect(mockManager.save).toHaveBeenCalledWith(GameEntity, gameEntity);
  });
});