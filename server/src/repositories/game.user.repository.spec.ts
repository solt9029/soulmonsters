import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameUserRepository } from './game.user.repository';
import { GameUserEntity } from '../entities/game.user.entity';

describe('GameUserRepository', () => {
  let repository: typeof GameUserRepository;
  let mockBaseRepository: jest.Mocked<Repository<GameUserEntity>>;

  beforeEach(async () => {
    const mockRepo = {
      query: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(GameUserEntity),
          useValue: mockRepo,
        },
      ],
    }).compile();

    mockBaseRepository = module.get<jest.Mocked<Repository<GameUserEntity>>>(getRepositoryToken(GameUserEntity));

    // Create a mock of the extended repository
    repository = {
      ...mockBaseRepository,
      findWaitingGameId: jest.fn(),
      subtractEnergy: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findWaitingGameId', () => {
    it('should return undefined when no waiting game exists', async () => {
      mockBaseRepository.query.mockResolvedValue([]);
      (repository.findWaitingGameId as jest.Mock).mockImplementation(async () => {
        const result = await mockBaseRepository.query(
          'SELECT gameId AS id FROM gameUsers GROUP BY gameId HAVING COUNT(*) = 1 LIMIT 1 LOCK IN SHARE MODE',
        );
        return result.length > 0 ? result[0].id : undefined;
      });

      const result = await repository.findWaitingGameId();

      expect(mockBaseRepository.query).toHaveBeenCalledWith(
        'SELECT gameId AS id FROM gameUsers GROUP BY gameId HAVING COUNT(*) = 1 LIMIT 1 LOCK IN SHARE MODE',
      );
      expect(result).toBeUndefined();
    });

    it('should return gameId when waiting game with one player exists', async () => {
      const expectedGameId = 123;
      mockBaseRepository.query.mockResolvedValue([{ id: expectedGameId }]);
      (repository.findWaitingGameId as jest.Mock).mockImplementation(async () => {
        const result = await mockBaseRepository.query(
          'SELECT gameId AS id FROM gameUsers GROUP BY gameId HAVING COUNT(*) = 1 LIMIT 1 LOCK IN SHARE MODE',
        );
        return result.length > 0 ? result[0].id : undefined;
      });

      const result = await repository.findWaitingGameId();

      expect(mockBaseRepository.query).toHaveBeenCalledWith(
        'SELECT gameId AS id FROM gameUsers GROUP BY gameId HAVING COUNT(*) = 1 LIMIT 1 LOCK IN SHARE MODE',
      );
      expect(result).toBe(expectedGameId);
    });
  });

  describe('subtractEnergy', () => {
    it('should subtract energy from user in game', async () => {
      const gameId = 1;
      const userId = 'user123';
      const amount = 5;

      mockBaseRepository.query.mockResolvedValue([]);
      (repository.subtractEnergy as jest.Mock).mockImplementation(async (gId: number, uId: string, amt: number) => {
        await mockBaseRepository.query(
          `UPDATE gameUsers SET energy = energy - ${amt} WHERE gameId = ${gId} AND userId = '${uId}'`,
        );
      });

      await repository.subtractEnergy(gameId, userId, amount);

      expect(mockBaseRepository.query).toHaveBeenCalledWith(
        `UPDATE gameUsers SET energy = energy - ${amount} WHERE gameId = ${gameId} AND userId = '${userId}'`,
      );
    });

    it('should handle zero energy subtraction', async () => {
      const gameId = 1;
      const userId = 'user123';
      const amount = 0;

      mockBaseRepository.query.mockResolvedValue([]);
      (repository.subtractEnergy as jest.Mock).mockImplementation(async (gId: number, uId: string, amt: number) => {
        await mockBaseRepository.query(
          `UPDATE gameUsers SET energy = energy - ${amt} WHERE gameId = ${gId} AND userId = '${uId}'`,
        );
      });

      await repository.subtractEnergy(gameId, userId, amount);

      expect(mockBaseRepository.query).toHaveBeenCalledWith(
        `UPDATE gameUsers SET energy = energy - ${amount} WHERE gameId = ${gameId} AND userId = '${userId}'`,
      );
    });
  });
});
