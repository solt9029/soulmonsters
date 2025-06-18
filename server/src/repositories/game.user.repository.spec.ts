import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { GameUserRepository } from './game.user.repository';
import { GameUserEntity } from '../entities/game.user.entity';
import { GameEntity } from '../entities/game.entity';
import { DeckEntity } from '../entities/deck.entity';

describe('GameUserRepository', () => {
  let gameUserRepository: GameUserRepository;
  let gameRepository: Repository<GameEntity>;
  let deckRepository: Repository<DeckEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(GameUserEntity),
          useClass: GameUserRepository,
        },
      ],
    }).compile();

    gameUserRepository = module.get<GameUserRepository>(getRepositoryToken(GameUserEntity));

    const connection = getConnection();
    gameRepository = connection.getRepository(GameEntity);
    deckRepository = connection.getRepository(DeckEntity);

    Object.assign(gameUserRepository, connection.getRepository(GameUserEntity));
  });

  // Factory methods for test data creation
  const createDeck = async (userId: string, name: string): Promise<DeckEntity> => {
    const deck = deckRepository.create({
      userId,
      name,
    });
    return await deckRepository.save(deck);
  };

  const createGame = async (): Promise<GameEntity> => {
    const game = gameRepository.create({});
    return await gameRepository.save(game);
  };

  const createGameUser = async (
    userId: string,
    game: GameEntity,
    deck: DeckEntity,
    options: Partial<GameUserEntity> = {},
  ) => {
    const gameUser = gameUserRepository.create({
      userId,
      energy: 0,
      lifePoint: 8000,
      lastViewedAt: new Date(),
      game,
      deck,
      ...options,
    });
    return await gameUserRepository.save(gameUser);
  };

  const createGameWithSinglePlayer = async (userId: string = 'user1', deckName: string = 'Test Deck') => {
    const deck = await createDeck(userId, deckName);
    const game = await createGame();
    const gameUser = await createGameUser(userId, game, deck);
    return { game, deck, gameUser };
  };

  const createGameWithTwoPlayers = async (
    user1Id: string = 'user1',
    user2Id: string = 'user2',
    deck1Name: string = 'Test Deck 1',
    deck2Name: string = 'Test Deck 2',
  ) => {
    const deck1 = await createDeck(user1Id, deck1Name);
    const deck2 = await createDeck(user2Id, deck2Name);
    const game = await createGame();
    const gameUser1 = await createGameUser(user1Id, game, deck1);
    const gameUser2 = await createGameUser(user2Id, game, deck2);
    return { game, deck1, deck2, gameUser1, gameUser2 };
  };

  describe('findWaitingGameId', () => {
    it('should return undefined when no waiting game exists', async () => {
      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBeUndefined();
    });

    it('should return gameId when waiting game with one player exists', async () => {
      const { game } = await createGameWithSinglePlayer();

      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBe(game.id);
    });

    it('should return undefined when multiple games exist but all have 2 players', async () => {
      await createGameWithTwoPlayers();

      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBeUndefined();
    });

    it('should return the first gameId when multiple waiting games exist', async () => {
      const { game: game1 } = await createGameWithSinglePlayer('user1', 'Test Deck 1');
      await createGameWithSinglePlayer('user2', 'Test Deck 2');

      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBe(game1.id);
    });

    it('should return waiting game ID when both waiting and full games exist', async () => {
      await createGameWithTwoPlayers('user1', 'user2', 'Test Deck 1', 'Test Deck 2');
      const { game: waitingGame } = await createGameWithSinglePlayer('user3', 'Test Deck 3');

      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBe(waitingGame.id);
    });
  });
});
