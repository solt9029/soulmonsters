import { MIN_DECK_CARD_COUNT } from './../constants/rule';
import { handleAction } from './../actions/action.handler';
import { ActionValidator } from '../actions/action.validator';
import { ActionGrantor } from '../actions/action.grantor';
import { GameActionDispatchInput } from './../graphql/index';
import { UserService } from './user.service';
import { GameCardEntityFactory } from './../factories/game.card.entity.factory';
import { GameEntity } from './../entities/game.entity';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import {
  GameRepository,
  GameUserRepository,
  DeckCardRepository,
  GameCardRepository,
  GameStateRepository,
} from '../repositories';

@Injectable()
export class GameService {
  constructor(
    private readonly userService: UserService,
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
    return await gameRepository.findById(id, {
      loadGameUsers: true,
      loadGameCards: true,
      loadGameStates: true,
      loadCardDetails: true,
      loadDeckDetails: true,
    });
  }

  async dispatchAction(
    id: number,
    userId: string,
    data: GameActionDispatchInput,
  ) {
    return this.connection.transaction(async manager => {
      const gameRepository = manager.getCustomRepository(GameRepository);
      const gameEntity = await gameRepository.findByIdWithLockForAction(id);

      const grantedGameEntity = this.actionGrantor.grantActions(
        gameEntity,
        userId,
      );

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
      const deckCardRepository = manager.getCustomRepository(
        DeckCardRepository,
      );
      const gameRepository = manager.getCustomRepository(GameRepository);
      const gameUserRepository = manager.getCustomRepository(
        GameUserRepository,
      );
      const gameCardRepository = manager.getCustomRepository(
        GameCardRepository,
      );

      const hasActiveGame = await gameRepository.hasActiveGame(userId);
      if (hasActiveGame) {
        throw new BadRequestException('User Active');
      }

      const deckCardEntities = await deckCardRepository.findDeckCardsWithLock(
        deckId,
      );
      if (
        deckCardEntities.length > 0 &&
        deckCardEntities[0].deck.userId !== userId
      ) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const totalCount = deckCardEntities.reduce(
        (accumulator, currentValue) => accumulator + currentValue.count,
        0,
      );
      if (totalCount < MIN_DECK_CARD_COUNT) {
        throw new BadRequestException('Min Count');
      }

      const waitingGameRawDataPackets = await gameUserRepository.findWaitingGameIds();

      // If waiting game does not exist, create new game
      if (waitingGameRawDataPackets.length === 0) {
        const gameInsertResult = await gameRepository.insert({});
        const gameId = gameInsertResult.identifiers[0].id;
        const gameCardEntities = this.gameCardEntityFactory.create(
          deckCardEntities,
          gameId,
        );
        await gameCardRepository.insertGameCards(gameCardEntities);
        await gameUserRepository.createGameUser({
          userId,
          deckId,
          gameId,
        });

        return await gameRepository.findById(gameId, {
          loadGameUsers: true,
          loadDeckDetails: true,
        });
      }

      // join the waiting game
      const waitingGameEntity = await gameRepository.findWaitingGameWithLock(
        waitingGameRawDataPackets[0].id,
      );
      const gameCardEntities = this.gameCardEntityFactory.create(
        deckCardEntities,
        waitingGameEntity.id,
      );
      await gameCardRepository.insertGameCards(gameCardEntities);
      const turnUserId =
        Math.floor(Math.random() * 2) === 1
          ? waitingGameEntity.gameUsers[0].userId
          : userId;
      await gameUserRepository.createGameUser({
        userId,
        deckId,
        gameId: waitingGameEntity.id,
        energy: turnUserId === userId ? 0 : 1,
      });
      await gameUserRepository.updateUserEnergy(
        waitingGameEntity.gameUsers[0].userId,
        turnUserId === userId ? 1 : 0,
      );
      await gameRepository.update(
        { id: waitingGameEntity.id },
        { startedAt: new Date(), turnUserId },
      );
      return await gameRepository.findById(waitingGameEntity.id, {
        loadGameUsers: true,
        loadDeckDetails: true,
      });
    });
  }
}
