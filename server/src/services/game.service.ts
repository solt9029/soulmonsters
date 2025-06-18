import { MIN_DECK_CARD_COUNT } from './../constants/rule';
import { handleAction } from './../actions/action.handler';
import { GameStateEntity } from '../entities/game.state.entity';
import { ActionValidator } from '../actions/action.validator';
import { ActionGrantor } from '../actions/action.grantor';
import { GameActionDispatchInput } from './../graphql/index';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GameCardEntityFactory } from './../factories/game.card.entity.factory';
import { DeckCardEntity } from './../entities/deck.card.entity';
import { GameEntity } from './../entities/game.entity';
import { Injectable, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { Repository, Connection, EntityRepository } from 'typeorm';
import { GameCardRepository } from '../repositories/game.card.repository';
import { GameUserRepository } from '../repositories/game.user.repository';

@EntityRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {}

@EntityRepository(DeckCardEntity)
export class DeckCardRepository extends Repository<DeckCardEntity> {}

@EntityRepository(GameStateEntity)
export class GameStateRepository extends Repository<GameStateEntity> {}

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly userService: UserService,
    private connection: Connection,
    private gameCardEntityFactory: GameCardEntityFactory,
    private actionGrantor: ActionGrantor,
    private actionValidator: ActionValidator,
  ) {}

  async findActiveGameByUserId(userId: string): Promise<GameEntity> {
    return await this.gameRepository
      .createQueryBuilder('games')
      .leftJoinAndSelect('games.gameUsers', 'gameUsers')
      .where('games.winnerUserId IS NULL')
      .andWhere('gameUsers.userId = :userId', { userId })
      .getOne();
  }

  async findById(id: number): Promise<GameEntity> {
    return await this.gameRepository.findOne({
      where: { id },
      relations: ['gameUsers', 'gameUsers.deck', 'gameCards', 'gameCards.card', 'gameStates', 'gameStates.gameCard'],
    });
  }

  async dispatchAction(id: number, userId: string, data: GameActionDispatchInput) {
    return this.connection.transaction(async manager => {
      const gameRepository = manager.getCustomRepository(GameRepository);
      const gameEntity = await gameRepository
        .createQueryBuilder('games')
        .setLock('pessimistic_read')
        .leftJoinAndSelect('games.gameUsers', 'gameUsers')
        .leftJoinAndSelect('games.gameCards', 'gameCards')
        .leftJoinAndSelect('gameCards.card', 'card')
        .leftJoinAndSelect('games.gameStates', 'gameStates')
        .leftJoinAndSelect('gameStates.gameCard', 'gameCard')
        .where('games.id = :id', { id })
        .getOne();

      const grantedGameEntity = this.actionGrantor.grantActions(gameEntity, userId);

      this.actionValidator.validateActions(data, grantedGameEntity, userId);

      // TODO: reflect status for gameEntity
      // [WARNING] this implementation is just for handleAttackAction. not correct!
      for (let i = 0; i < gameEntity.gameCards.length; i++) {
        gameEntity.gameCards[i].attack = gameEntity.gameCards[i].card.attack;
        gameEntity.gameCards[i].defence = gameEntity.gameCards[i].card.defence;
      }

      // TODO:check events

      return await handleAction(id, data, manager, userId, gameEntity);
    });
  }

  async start(userId: string, deckId: number) {
    return this.connection.transaction(async manager => {
      const deckCardRepository = manager.getCustomRepository(DeckCardRepository);
      const gameRepository = manager.getCustomRepository(GameRepository);
      const gameUserRepository = manager.getCustomRepository(GameUserRepository);
      const gameCardRepository = manager.getCustomRepository(GameCardRepository);

      const userActiveGameEntity = await gameRepository
        .createQueryBuilder('games')
        .leftJoinAndSelect('games.gameUsers', 'gameUsers')
        .where('games.winnerUserId IS NULL')
        .andWhere('gameUsers.userId = :userId', { userId })
        .getOne();
      if (userActiveGameEntity !== undefined) {
        throw new BadRequestException('User Active');
      }

      const deckCardEntities = await deckCardRepository
        .createQueryBuilder('deckCards')
        .setLock('pessimistic_read')
        .leftJoinAndSelect('deckCards.card', 'card')
        .leftJoinAndSelect('deckCards.deck', 'deck')
        .where('deckCards.deckId = :deckId', { deckId })
        .getMany();
      if (deckCardEntities.length > 0 && deckCardEntities[0].deck.userId !== userId) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const totalCount = deckCardEntities.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
      if (totalCount < MIN_DECK_CARD_COUNT) {
        throw new BadRequestException('Min Count');
      }

      const waitingGameId = await gameUserRepository.findWaitingGameId();

      // If waiting game does not exist, create new game
      if (waitingGameId === undefined) {
        const gameInsertResult = await gameRepository.insert({});
        const gameId = gameInsertResult.identifiers[0].id;
        const gameCardEntities = this.gameCardEntityFactory.create(deckCardEntities, gameId);
        await gameCardRepository.insert(gameCardEntities);
        await gameUserRepository.insert({
          userId,
          deck: { id: deckId },
          lastViewedAt: new Date(),
          game: { id: gameId },
        });

        return await gameRepository.findOne({
          where: { id: gameId },
          relations: ['gameUsers', 'gameUsers.deck'],
        });
      }

      // join the waiting game
      const waitingGameEntity = await gameRepository
        .createQueryBuilder('games')
        .setLock('pessimistic_read')
        .leftJoinAndSelect('games.gameUsers', 'gameUsers')
        .where('games.id = :gameId', {
          gameId: waitingGameId,
        })
        .getOne();
      const gameCardEntities = this.gameCardEntityFactory.create(deckCardEntities, waitingGameEntity.id);
      await gameCardRepository.insert(gameCardEntities);
      const turnUserId = Math.floor(Math.random() * 2) === 1 ? waitingGameEntity.gameUsers[0].userId : userId;
      await gameUserRepository.insert({
        userId,
        deck: { id: deckId },
        energy: turnUserId === userId ? 0 : 1,
        lastViewedAt: new Date(),
        game: { id: waitingGameEntity.id },
      });
      await gameUserRepository.update(
        { userId: waitingGameEntity.gameUsers[0].userId },
        { energy: turnUserId === userId ? 1 : 0 },
      );
      await gameRepository.update({ id: waitingGameEntity.id }, { startedAt: new Date(), turnUserId });
      return await gameRepository.findOne({
        where: { id: waitingGameEntity.id },
        relations: ['gameUsers', 'gameUsers.deck'],
      });
    });
  }
}
