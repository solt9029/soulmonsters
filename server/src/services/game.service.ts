import { MIN_DECK_CARD_COUNT } from './../constants/rule';
import { handleAction } from './../actions/action.handler';
import { ActionValidator } from '../actions/action.validator';
import { ActionGrantor } from '../actions/action.grantor';
import { GameActionDispatchInput } from './../graphql/index';
import { InjectRepository } from '@nestjs/typeorm';
import { GameCardEntityFactory } from './../factories/game.card.entity.factory';
import { GameEntity } from './../entities/game.entity';
import { Injectable, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { GameCardRepository } from 'src/repositories/game.card.repository';
import { GameUserRepository } from 'src/repositories/game.user.repository';
import { GameRepository } from 'src/repositories/game.repository';
import { DeckCardRepository } from 'src/repositories/deck.card.repository';

@Injectable()
export class GameService {
  constructor(
    private connection: Connection,
    private gameCardEntityFactory: GameCardEntityFactory,
    private actionGrantor: ActionGrantor,
    private actionValidator: ActionValidator,
  ) {}

  async findActiveGameByUserId(userId: string): Promise<GameEntity | undefined> {
    const gameRepository = this.connection.getCustomRepository(GameRepository);
    return await gameRepository.findActiveGameByUserId(userId);
  }

  async findById(id: number): Promise<GameEntity | undefined> {
    const gameRepository = this.connection.getCustomRepository(GameRepository);
    return await gameRepository.findByIdWithRelations(id);
  }

  async dispatchAction(id: number, userId: string, data: GameActionDispatchInput) {
    return this.connection.transaction(async manager => {
      const gameRepository = manager.getCustomRepository(GameRepository);
      const gameEntity = await gameRepository.findByIdWithRelationsAndLock(id);

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

      const userActiveGameEntity = await gameRepository.findActiveGameByUserId(userId);
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

        return await gameRepository.findByIdWithGameUsersAndDeck(gameId);
      }

      // join the waiting game
      const waitingGameEntity = await gameRepository.findByIdWithRelationsAndLock(waitingGameId);
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
      return await gameRepository.findByIdWithGameUsersAndDeck(waitingGameEntity.id);
    });
  }
}
