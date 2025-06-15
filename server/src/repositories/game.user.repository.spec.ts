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

    // 実際のデータベース接続からリポジトリを取得
    const connection = getConnection();
    gameRepository = connection.getRepository(GameEntity);
    deckRepository = connection.getRepository(DeckEntity);

    // GameUserRepositoryに実際のデータベース接続を設定
    Object.assign(gameUserRepository, connection.getRepository(GameUserEntity));
  });

  describe('findWaitingGameId', () => {
    it('待機中のゲームが存在しない場合、undefinedを返す', async () => {
      // テスト実行（データなし）
      const result = await gameUserRepository.findWaitingGameId();

      // 検証
      expect(result).toBeUndefined();
    });

    it('待機中のゲーム（1人のプレイヤー）が存在する場合、gameIdを返す', async () => {
      // テストデータ作成
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

      // テスト実行
      const result = await gameUserRepository.findWaitingGameId();

      // 検証
      expect(result).toBe(game.id);
    });

    it('複数のゲームが存在するが、すべて2人以上の場合、undefinedを返す', async () => {
      // テストデータ作成（2人のプレイヤーがいるゲーム）
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

      // テスト実行
      const result = await gameUserRepository.findWaitingGameId();

      // 検証
      expect(result).toBeUndefined();
    });

    it('複数の待機中ゲームが存在する場合、最初の1つのgameIdを返す', async () => {
      // テストデータ作成（2つの待機中ゲーム）
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

      // テスト実行
      const result = await gameUserRepository.findWaitingGameId();

      // 検証（最初に作成されたゲームのIDが返される）
      expect(result).toBe(game1.id);
    });

    it('混在する場合（待機中と満員のゲーム）、待機中のゲームIDを返す', async () => {
      // テストデータ作成
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

      // 満員のゲーム（2人）
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

      // 待機中のゲーム（1人）
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

      // テスト実行
      const result = await gameUserRepository.findWaitingGameId();

      // 検証
      expect(result).toBe(waitingGame.id);
    });
  });
});
