import { AppDataSource } from '../dataSource';
import { GameEntity } from '../entities/game.entity';
import { GameModel } from '../models/game.model';

const toModel = (entity: GameEntity | null): GameModel | null => {
  if (!entity) return null;
  return new GameModel({
    id: entity.id,
    turnUserId: entity.turnUserId,
    phase: entity.phase,
    winnerUserId: entity.winnerUserId,
    turnCount: entity.turnCount,
    startedAt: entity.startedAt,
    endedAt: entity.endedAt,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    gameUsers: entity.gameUsers,
    gameCards: entity.gameCards,
    gameStates: entity.gameStates,
  });
};

export const GameRepository = AppDataSource.getRepository(GameEntity).extend({
  async findActiveGameByUserId(userId: string): Promise<GameModel | null> {
    const entity = await this.createQueryBuilder('games')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getOne();
    return toModel(entity);
  },

  async findByIdWithRelations(id: number): Promise<GameModel | null> {
    const entity = await this.findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck', 'gameCards', 'gameCards.card', 'gameStates', 'gameStates.gameCard'],
    });
    return toModel(entity);
  },

  async findByIdWithRelationsAndLock(id: number): Promise<GameModel | null> {
    const entity = await this.createQueryBuilder('games')
      .setLock('pessimistic_read')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .leftJoinAndSelect('games.gameCards', 'gameCards')
      .leftJoinAndSelect('gameCards.card', 'card')
      .leftJoinAndSelect('games.gameStates', 'gameStates')
      .leftJoinAndSelect('gameStates.gameCard', 'gameCard')
      .where('games.id = :id', { id })
      .getOne();
    return toModel(entity);
  },

  async findByIdWithGameUsersAndDeck(id: number): Promise<GameModel | null> {
    const entity = await this.findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck'],
    });
    return toModel(entity);
  },
});
