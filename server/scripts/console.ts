import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/modules/app.module';
import { CardService } from '../src/services/card.service';
import { DeckService } from '../src/services/deck.service';
import { GameService } from '../src/services/game.service';
import { UserService } from '../src/services/user.service';
import { Connection } from 'typeorm';
import * as repl from 'repl';

async function bootstrap() {
  console.log('Starting Nest.js Console...');

  const app = await NestFactory.createApplicationContext(AppModule);

  // Get services
  const cardService = app.get(CardService);
  const deckService = app.get(DeckService);
  const gameService = app.get(GameService);
  const userService = app.get(UserService);

  // Get database connection
  const connection = app.get(Connection);

  console.log('✅ Nest.js application context loaded');
  console.log('📋 Available variables:');
  console.log('  - cardService');
  console.log('  - deckService');
  console.log('  - gameService');
  console.log('  - userService');
  console.log('  - connection (TypeORM connection)');
  console.log('  - app (Nest.js application context)');
  console.log('');
  console.log('💡 Usage examples:');
  console.log('  await connection.query("SELECT * FROM games LIMIT 5")');
  console.log('  await gameService.findAll()');
  console.log('');

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
