import { MIN_DECK_CARD_COUNT } from 'src/constants/rule';
import { handleAction } from 'src/game/actions/handlers/index';
import { GameActionDispatchInput } from 'src/graphql/index';
import { GameEntity } from 'src/entities/game.entity';
import { Injectable, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GameCardRepository } from 'src/repositories/game.card.repository';
import { GameUserRepository } from 'src/repositories/game.user.repository';
import { GameRepository } from 'src/repositories/game.repository';
import { DeckCardRepository } from 'src/repositories/deck.card.repository';
import { grantActions } from 'src/game/actions/grantors/index';
import { initializeGameCards } from 'src/game/initializers';
import { reflectStates } from 'src/game/states/reflectors';

@Injectable()
export class GameService {
  constructor(private dataSource: DataSource) {}

  async findActiveGameByUserId(userId: string): Promise<GameEntity | null> {
    return await GameRepository.findActiveGameByUserId(userId);
  }

  async findById(id: number): Promise<GameEntity | null> {
    return await GameRepository.findByIdWithRelations(id);
  }

  async dispatchAction(id: number, userId: string, data: GameActionDispatchInput) {
    return this.dataSource.transaction(async manager => {
      const gameRepository = manager.withRepository(GameRepository);
      const gameEntity = await gameRepository.findByIdWithRelationsAndLock(id);

      if (!gameEntity) {
        throw new Error('Game not found');
      }

      // 各プレイヤー・カードなどがどんなアクションをできるかを計算する
      const grantedGameEntity = grantActions(gameEntity, userId);

      // GameState 状態を GameCard に反映する（攻撃力の減少など）
      const statusReflectedGameEntity = reflectStates(grantedGameEntity, userId);

      // TODO:check events. handleActionの中でやるかなあ？別で切り出す？
      //   例: このカードが攻撃された時、みたいなやつをチェックする必要があるよ
      return await handleAction(data, manager, userId, statusReflectedGameEntity);
    });
  }

  async start(userId: string, deckId: number) {
    return this.dataSource.transaction(async manager => {
      const deckCardRepository = manager.withRepository(DeckCardRepository);
      const gameRepository = manager.withRepository(GameRepository);
      const gameUserRepository = manager.withRepository(GameUserRepository);
      const gameCardRepository = manager.withRepository(GameCardRepository);

      const userActiveGameEntity = await gameRepository.findActiveGameByUserId(userId);

      if (userActiveGameEntity !== null) {
        throw new BadRequestException('User Active');
      }

      const deckCardEntities = await deckCardRepository
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

      const waitingGameId = await gameUserRepository.findWaitingGameId();

      // If waiting game does not exist, create new game
      if (waitingGameId === undefined) {
        const gameInsertResult = await gameRepository.insert({});

        if (!gameInsertResult.identifiers[0]) {
          throw new Error('Failed to create game');
        }

        const gameId = gameInsertResult.identifiers[0].id;
        const gameCardEntities = initializeGameCards(deckCardEntities, gameId);

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

      if (!waitingGameEntity) {
        throw new Error('Waiting game not found');
      }

      const gameCardEntities = initializeGameCards(deckCardEntities, waitingGameEntity.id);
      await gameCardRepository.insert(gameCardEntities);

      const existingGameUser = waitingGameEntity.gameUsers[0];

      if (!existingGameUser) {
        throw new Error('First game user not found');
      }

      const turnUserId = Math.floor(Math.random() * 2) === 1 ? existingGameUser.userId : userId;

      await gameUserRepository.insert({
        userId,
        deck: { id: deckId },
        energy: turnUserId === userId ? 0 : 1,
        lastViewedAt: new Date(),
        game: { id: waitingGameEntity.id },
      });

      await gameUserRepository.update({ userId: existingGameUser.userId }, { energy: turnUserId === userId ? 1 : 0 });

      await gameRepository.update({ id: waitingGameEntity.id }, { startedAt: new Date(), turnUserId });

      return await gameRepository.findByIdWithGameUsersAndDeck(waitingGameEntity.id);
    });
  }
}
