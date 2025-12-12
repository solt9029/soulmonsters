import { AppDataSource } from '../dataSource';
import { GameEntity } from '../entities/game.entity';
import { GameModel } from '../models/game.model';
import { GameStateModel } from '../models/game-state.model';
import { GameStateEntity } from '../entities/game-state.entity';
import { GameUserEntity } from 'src/entities/game-user.entity';
import { GameUserModel } from 'src/models/game-user.model';
import { GameCardEntity } from 'src/entities/game-card.entity';
import { GameCardModel } from 'src/models/game-card.model';

const toGameUserModel = (entity: GameUserEntity): GameUserModel => {
  return new GameUserModel({
    id: entity.id,
    userId: entity.userId,
    energy: entity.energy,
    lifePoint: entity.lifePoint,
    lastViewedAt: entity.lastViewedAt,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    deck: entity.deck,
    actionTypes: [], // Databaseで保持していないのでEntity => Model化する際には常に空配列がセットされる
  });
};

const toGameCardModel = (entity: GameCardEntity): GameCardModel => {
  return new GameCardModel({
    id: entity.id,
    originalUserId: entity.originalUserId,
    currentUserId: entity.currentUserId,
    zone: entity.zone,
    position: entity.position,
    battlePosition: entity.battlePosition,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    card: entity.card,
    game: entity.game,
    gameStates: entity.gameStates,
    actionTypes: [], // Databaseで保持していないのでEntity => Model化する際には常に空配列がセットされる
    name: entity.name,
    kind: entity.kind,
    type: entity.type,
    attribute: entity.attribute,
    attack: entity.attack,
    defence: entity.defence,
    cost: entity.cost,
    detail: entity.detail,
  });
};

const toGameStateModel = (entity: GameStateEntity): GameStateModel => {
  return new GameStateModel({
    id: entity.id,
    game: entity.game,
    gameCard: entity.gameCard ? toGameCardModel(entity.gameCard) : null,
    state: entity.state,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  });
};

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
    gameUsers: (entity.gameUsers ?? []).map(entity => toGameUserModel(entity)),
    gameCards: (entity.gameCards ?? []).map(entity => toGameCardModel(entity)),
    gameStates: (entity.gameStates ?? []).map(entity => toGameStateModel(entity)),
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
