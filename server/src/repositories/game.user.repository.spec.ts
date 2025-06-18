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

    gameUserRepository = module.get<GameUserRepository>(
      getRepositoryToken(GameUserEntity),
    );

    const connection = getConnection();
    gameRepository = connection.getRepository(GameEntity);
    deckRepository = connection.getRepository(DeckEntity);

    Object.assign(gameUserRepository, connection.getRepository(GameUserEntity));
  });

  describe('findWaitingGameId', () => {
    it('should return undefined when no waiting game exists', async () => {
      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBeUndefined();
    });

    it('should return gameId when waiting game with one player exists', async () => {
      const deck = deckRepository.create({
        userId: 'user1',
        name: 'Test Deck',
      });
      await deckRepository.save(deck);

      const game = gameRepository.create({});
      await gameRepository.save(game);

      const gameUser = gameUserRepository.create({
        userId: 'user1',
        energy: 0,
        lifePoint: 8000,
        lastViewedAt: new Date(),
        game: game,
        deck: deck,
      });
      await gameUserRepository.save(gameUser);

      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBe(game.id);
    });

    it('should return undefined when multiple games exist but all have 2 or more players', async () => {
      const deck1 = deckRepository.create({
        userId: 'user1',
        name: 'Test Deck 1',
      });
      const deck2 = deckRepository.create({
        userId: 'user2',
        name: 'Test Deck 2',
      });
      await deckRepository.save([deck1, deck2]);

      const game = gameRepository.create({});
      await gameRepository.save(game);

      const gameUser1 = gameUserRepository.create({
        userId: 'user1',
        energy: 0,
        lifePoint: 8000,
        lastViewedAt: new Date(),
        game: game,
        deck: deck1,
      });
      const gameUser2 = gameUserRepository.create({
        userId: 'user2',
        energy: 0,
        lifePoint: 8000,
        lastViewedAt: new Date(),
        game: game,
        deck: deck2,
      });
      await gameUserRepository.save([gameUser1, gameUser2]);

      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBeUndefined();
    });

    it('should return the first gameId when multiple waiting games exist', async () => {
      const deck1 = deckRepository.create({
        userId: 'user1',
        name: 'Test Deck 1',
      });
      const deck2 = deckRepository.create({
        userId: 'user2',
        name: 'Test Deck 2',
      });
      await deckRepository.save([deck1, deck2]);

      const game1 = gameRepository.create({});
      const game2 = gameRepository.create({});
      await gameRepository.save([game1, game2]);

      const gameUser1 = gameUserRepository.create({
        userId: 'user1',
        energy: 0,
        lifePoint: 8000,
        lastViewedAt: new Date(),
        game: game1,
        deck: deck1,
      });
      const gameUser2 = gameUserRepository.create({
        userId: 'user2',
        energy: 0,
        lifePoint: 8000,
        lastViewedAt: new Date(),
        game: game2,
        deck: deck2,
      });
      await gameUserRepository.save([gameUser1, gameUser2]);

      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBe(game1.id);
    });

    it('should return waiting game ID when both waiting and full games exist', async () => {
      const deck1 = deckRepository.create({
        userId: 'user1',
        name: 'Test Deck 1',
      });
      const deck2 = deckRepository.create({
        userId: 'user2',
        name: 'Test Deck 2',
      });
      const deck3 = deckRepository.create({
        userId: 'user3',
        name: 'Test Deck 3',
      });
      await deckRepository.save([deck1, deck2, deck3]);

      const fullGame = gameRepository.create({});
      await gameRepository.save(fullGame);

      const fullGameUser1 = gameUserRepository.create({
        userId: 'user1',
        energy: 0,
        lifePoint: 8000,
        lastViewedAt: new Date(),
        game: fullGame,
        deck: deck1,
      });
      const fullGameUser2 = gameUserRepository.create({
        userId: 'user2',
        energy: 0,
        lifePoint: 8000,
        lastViewedAt: new Date(),
        game: fullGame,
        deck: deck2,
      });

      const waitingGame = gameRepository.create({});
      await gameRepository.save(waitingGame);

      const waitingGameUser = gameUserRepository.create({
        userId: 'user3',
        energy: 0,
        lifePoint: 8000,
        lastViewedAt: new Date(),
        game: waitingGame,
        deck: deck3,
      });

      await gameUserRepository.save([
        fullGameUser1,
        fullGameUser2,
        waitingGameUser,
      ]);

      const result = await gameUserRepository.findWaitingGameId();

      expect(result).toBe(waitingGame.id);
    });
  });
});
