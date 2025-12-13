import { AppDataSource } from '../dataSource';
import { GameEntity } from '../entities/game.entity';
import { GameModel } from '../models/game.model';
import { GameToModelMapper } from '../mappers/to-model/game.to-model.mapper';
import { GameUserToModelMapper } from '../mappers/to-model/game-user.to-model.mapper';
import { GameCardToModelMapper } from '../mappers/to-model/game-card.to-model.mapper';
import { GameStateToModelMapper } from '../mappers/to-model/game-state.to-model.mapper';
import { DeckToModelMapper } from '../mappers/to-model/deck.to-model.mapper';
import { CardToModelMapper } from '../mappers/to-model/card.to-model.mapper';

const cardToModelMapper = new CardToModelMapper();
const deckToModelMapper = new DeckToModelMapper();
const gameStateToModelMapper = new GameStateToModelMapper();
const gameUserToModelMapper = new GameUserToModelMapper(deckToModelMapper);
const gameCardToModelMapper = new GameCardToModelMapper(cardToModelMapper);
const gameToModelMapper = new GameToModelMapper(gameUserToModelMapper, gameCardToModelMapper, gameStateToModelMapper);

export const GameRepository = AppDataSource.getRepository(GameEntity).extend({
  async findActiveGameByUserId(userId: string): Promise<GameModel | null> {
    const entity = await this.createQueryBuilder('games')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getOne();

    return entity ? gameToModelMapper.toModel(entity) : null;
  },

  async findByIdWithRelations(id: number): Promise<GameModel | null> {
    const entity = await this.findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck', 'gameCards', 'gameCards.card', 'gameStates', 'gameStates.gameCard'],
    });

    return entity ? gameToModelMapper.toModel(entity) : null;
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

    return entity ? gameToModelMapper.toModel(entity) : null;
  },

  async findByIdWithGameUsersAndDeck(id: number): Promise<GameModel | null> {
    const entity = await this.findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck'],
    });

    return entity ? gameToModelMapper.toModel(entity) : null;
  },
});
