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
import { DataSource } from 'typeorm';
import * as repl from 'repl';

async function bootstrap() {
  console.log('Starting Nest.js Console...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const replServer = repl.start({
    prompt: 'nest> ',
    useColors: true,
  });

  // Add variables to REPL context
  replServer.context.cardService = app.get(CardService);
  replServer.context.deckService = app.get(DeckService);
  replServer.context.gameService = app.get(GameService);
  replServer.context.userService = app.get(UserService);
  replServer.context.gameRepository = GameRepository;
  replServer.context.gameUserRepository = GameUserRepository;
  replServer.context.gameCardRepository = GameCardRepository;
  replServer.context.gameStateRepository = GameStateRepository;
  replServer.context.deckCardRepository = DeckCardRepository;
  replServer.context.dataSource = dataSource;
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
