import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/modules/app.module';
import { CardService } from '../src/services/card.service';
import { DeckService } from '../src/services/deck.service';
import { GameService } from '../src/services/game.service';
import { UserService } from '../src/services/user.service';
import { GameRepository } from '../src/repositories/game.repository';
import { GameUserRepository } from '../src/repositories/game.user.repository';
import { GameCardRepository } from '../src/repositories/game.card.repository';
import { GameStateRepository } from '../src/repositories/game.state.repository';
import { DeckCardRepository } from '../src/repositories/deck.card.repository';
import { Connection } from 'typeorm';
import * as repl from 'repl';

async function bootstrap() {
  console.log('Starting Nest.js Console...');

  const app = await NestFactory.createApplicationContext(AppModule);

  // Get database connection
  const connection = app.get(Connection);

  // Get services
  const cardService = app.get(CardService);
  const deckService = app.get(DeckService);
  const gameService = app.get(GameService);
  const userService = app.get(UserService);

  // Get repositories using getCustomRepository
  const gameRepository = connection.getCustomRepository(GameRepository);
  const gameUserRepository = connection.getCustomRepository(GameUserRepository);
  const gameCardRepository = connection.getCustomRepository(GameCardRepository);
  const gameStateRepository = connection.getCustomRepository(GameStateRepository);
  const deckCardRepository = connection.getCustomRepository(DeckCardRepository);

  // Start REPL
  const replServer = repl.start({
    prompt: 'nest> ',
    useColors: true,
  });

  // Add variables to REPL context
  replServer.context.cardService = cardService;
  replServer.context.deckService = deckService;
  replServer.context.gameService = gameService;
  replServer.context.userService = userService;
  replServer.context.gameRepository = gameRepository;
  replServer.context.gameUserRepository = gameUserRepository;
  replServer.context.gameCardRepository = gameCardRepository;
  replServer.context.gameStateRepository = gameStateRepository;
  replServer.context.deckCardRepository = deckCardRepository;
  replServer.context.connection = connection;
  replServer.context.app = app;

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
