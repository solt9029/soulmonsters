import { MIN_DECK_CARD_COUNT } from 'src/constants/rule';
import { GameActionHandler } from 'src/game/actions/handlers/game.action.handler';
import { GameActionDispatchInput } from 'src/graphql/index';
import { Injectable, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GameCardRepository } from 'src/repositories/game-card.repository';
import { GameUserRepository } from 'src/repositories/game-user.repository';
import { GameRepository } from 'src/repositories/game.repository';
import { DeckCardEntity } from 'src/entities/deck-card.entity';
import { GameActionGrantor } from 'src/game/actions/grantors/game.action.grantor';
import { initializeGameCards } from 'src/game/initializers';
import { reflectStates } from 'src/game/states/reflectors';

@Injectable()
export class GameService {
  constructor(
    private dataSource: DataSource,
    private gameCardRepository: GameCardRepository,
    private gameUserRepository: GameUserRepository,
    private gameRepository: GameRepository,
    private gameActionGrantor: GameActionGrantor,
    private gameActionHandler: GameActionHandler,
  ) {}

  async dispatchAction(id: number, userId: string, data: GameActionDispatchInput) {
    return this.dataSource.transaction(async manager => {
      const gameModel = await this.gameRepository.findByIdWithRelationsAndLock(id, manager);

      if (!gameModel) {
        throw new Error('Game not found');
      }

      // 各プレイヤー・カードなどがどんなアクションをできるかを計算する
      const grantedGameModel = this.gameActionGrantor.grantActions(gameModel, userId);

      // GameState 状態を GameCard に反映する（攻撃力の減少など）
      const statusReflectedGameModel = reflectStates(grantedGameModel, userId);

      // TODO:check events. handleActionの中でやるかなあ？別で切り出す？
      //   例: このカードが攻撃された時、みたいなやつをチェックする必要があるよ
      return await this.gameActionHandler.handleAction(data, manager, userId, statusReflectedGameModel);
    });
  }

  async start(userId: string, deckId: number) {
    return this.dataSource.transaction(async manager => {
      const userActiveGameEntity = await this.gameRepository.findActiveGameByUserId(userId, manager);

      if (userActiveGameEntity !== null) {
        throw new BadRequestException('User Active');
      }

      const deckCardEntities = await manager
        .getRepository(DeckCardEntity)
        .createQueryBuilder('deckCards')
        .setLock('pessimistic_read')
        .leftJoinAndSelect('deckCards.card', 'card')
        .leftJoinAndSelect('deckCards.deck', 'deck')
        .where('deckCards.deckId = :deckId', { deckId })
        .getMany();

      if (deckCardEntities[0] && deckCardEntities[0].deck.userId !== userId) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const totalCount = deckCardEntities.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
      if (totalCount < MIN_DECK_CARD_COUNT) {
        throw new BadRequestException('Min Count');
      }

      const waitingGameId = await this.gameUserRepository.findWaitingGameId(manager);

      // If waiting game does not exist, create new game
      if (waitingGameId === undefined) {
        const gameInsertResult = await this.gameRepository.insert({}, manager);

        if (!gameInsertResult.identifiers[0]) {
          throw new Error('Failed to create game');
        }

        const gameId = gameInsertResult.identifiers[0].id;
        const gameCardEntities = initializeGameCards(deckCardEntities, gameId);

        await this.gameCardRepository.insert(gameCardEntities, manager);
        await this.gameUserRepository.insert(
          {
            userId,
            deck: { id: deckId },
            lastViewedAt: new Date(),
            game: { id: gameId },
          },
          manager,
        );

        return await this.gameRepository.findByIdWithGameUsersAndDeck(gameId, manager);
      }

      // join the waiting game
      const waitingGameEntity = await this.gameRepository.findByIdWithRelationsAndLock(waitingGameId, manager);

      if (!waitingGameEntity) {
        throw new Error('Waiting game not found');
      }

      const gameCardEntities = initializeGameCards(deckCardEntities, waitingGameEntity.id);
      await this.gameCardRepository.insert(gameCardEntities, manager);

      const existingGameUser = waitingGameEntity.gameUsers[0];

      if (!existingGameUser) {
        throw new Error('First game user not found');
      }

      const turnUserId = Math.floor(Math.random() * 2) === 1 ? existingGameUser.userId : userId;

      await this.gameUserRepository.insert(
        {
          userId,
          deck: { id: deckId },
          energy: turnUserId === userId ? 0 : 1,
          lastViewedAt: new Date(),
          game: { id: waitingGameEntity.id },
        },
        manager,
      );

      await this.gameUserRepository.update(
        { userId: existingGameUser.userId },
        { energy: turnUserId === userId ? 1 : 0 },
        manager,
      );

      await this.gameRepository.update({ id: waitingGameEntity.id }, { startedAt: new Date(), turnUserId }, manager);

      return await this.gameRepository.findByIdWithGameUsersAndDeck(waitingGameEntity.id, manager);
    });
  }
}
