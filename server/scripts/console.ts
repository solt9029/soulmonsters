import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/modules/app.module';
import { CardService } from '../src/services/card.service';
import { DeckService } from '../src/services/deck.service';
import { DeckCardService } from '../src/services/deck.card.service';
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

  const replServer = repl.start({
    prompt: 'nest> ',
    useColors: true,
  });

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const cardService = app.get(CardService);
  const deckService = app.get(DeckService);
  const deckCardService = app.get(DeckCardService);
  const gameService = app.get(GameService);
  const userService = app.get(UserService);

  const createDebugDeck = async (userId: string) => {
    const deckName = `${new Date().toISOString()}`;
    const deck = await deckService.create(userId, deckName);

    for (let cardId = 1; cardId <= 14; cardId++) {
      const deckCard = await deckCardService.create(deck.id, cardId);
      await deckCardService.updateCountById(deckCard.id, 3);
    }

    return deck;
  };

  replServer.context.app = app;
  replServer.context.dataSource = dataSource;
  replServer.context.cardService = cardService;
  replServer.context.deckService = deckService;
  replServer.context.deckCardService = deckCardService;
  replServer.context.gameService = gameService;
  replServer.context.userService = userService;
  replServer.context.gameRepository = GameRepository;
  replServer.context.gameUserRepository = GameUserRepository;
  replServer.context.gameCardRepository = GameCardRepository;
  replServer.context.gameStateRepository = GameStateRepository;
  replServer.context.deckCardRepository = DeckCardRepository;
  replServer.context.createDebugDeck = createDebugDeck;

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
