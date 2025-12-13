import { CardRepository } from './../src/repositories/card.repository';
import { GameEntity } from 'src/entities/game.entity';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/modules/app.module';
import { GameService } from '../src/services/game.service';
import { UserService } from '../src/services/user.service';
import { GameRepository } from '../src/repositories/game.repository';
import { GameUserRepository } from '../src/repositories/game-user.repository';
import { GameCardRepository } from '../src/repositories/game-card.repository';
import { GameStateRepository } from '../src/repositories/game-state.repository';
import { DeckCardRepository } from '../src/repositories/deck-card.repository';
import { DataSource, IsNull } from 'typeorm';
import * as repl from 'repl';
import { CardEntity } from 'src/entities/card.entity';
import { GameCardEntity } from 'src/entities/game-card.entity';
import { DeckRepository } from 'src/repositories/deck.repository';

async function bootstrap() {
  console.log('Starting Nest.js Console...');

  const replServer = repl.start({
    prompt: 'nest> ',
    useColors: true,
  });

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const cardRepository = app.get(CardRepository);
  const gameStateRepository = app.get(GameStateRepository);
  const deckRepository: typeof DeckRepository = app.get('DeckRepository');
  const deckCardRepository: typeof DeckCardRepository = app.get('DeckCardRepository');
  const gameService = app.get(GameService);
  const userService = app.get(UserService);

  const createDebugDeck = async (userId: string) => {
    const deckName = `${new Date().toISOString()}`;
    const deck = await deckRepository.createDeck(userId, deckName);

    for (let cardId = 1; cardId <= 14; cardId++) {
      const deckCard = await deckCardRepository.createDeckCard(deck.id, cardId);
      await deckCardRepository.updateCountById(deckCard.id, 3);
    }

    return deck;
  };

  const sql = async (query: string, parameters?: any[]) => {
    return await dataSource.query(query, parameters);
  };

  const deleteActiveGames = async () => {
    const gameRepository = dataSource.getRepository(GameEntity);

    const activeGames = await gameRepository.find({
      where: { endedAt: IsNull() },
      relations: ['gameUsers', 'gameCards', 'gameStates'],
    });

    for (const game of activeGames) {
      const gameId = game.id;
      await gameRepository.remove(game);
      console.log(`Deleted Game ID: ${gameId}`);
    }
  };

  replServer.context.app = app;
  replServer.context.dataSource = dataSource;

  replServer.context.cardRepository = cardRepository;
  replServer.context.deckRepository = deckRepository;
  replServer.context.deckCardRepository = deckCardRepository;
  replServer.context.gameService = gameService;
  replServer.context.userService = userService;

  replServer.context.gameRepository = GameRepository;
  replServer.context.gameUserRepository = GameUserRepository;
  replServer.context.gameCardRepository = GameCardRepository;
  replServer.context.gameStateRepository = gameStateRepository;
  replServer.context.deckCardRepository = DeckCardRepository;

  // TODO: 全部のEntityをここに登録する
  replServer.context.GameEntity = GameEntity;
  replServer.context.CardEntity = CardEntity;
  replServer.context.GameCardEntity = GameCardEntity;

  replServer.context.createDebugDeck = createDebugDeck;
  replServer.context.sql = sql;
  replServer.context.deleteActiveGames = deleteActiveGames;

  // Handle REPL exit
  replServer.on('exit', async () => {
    console.log('\n👋 Closing Nest.js application...');
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch(err => {
  console.error('❌ Error starting console:', err);
  process.exit(1);
});
