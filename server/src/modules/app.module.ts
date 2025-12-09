import { GameStateEntity } from '../entities/game.state.entity';
import { GameCardEntity } from './../entities/game.card.entity';
import { GameResolver } from './../resolvers/game.resolver';
import { GameService } from './../services/game.service';
import { GameEntity } from './../entities/game.entity';
import { DeckCardResolver } from './../resolvers/deck.card.resolver';
import { DeckCardService } from './../services/deck.card.service';
import { DeckCardEntity } from './../entities/deck.card.entity';
import { CardEntity } from './../entities/card.entity';
import { CardResolver } from './../resolvers/card.resolver';
import { CardService } from './../services/card.service';
import { DeckResolver } from './../resolvers/deck.resolver';
import { DeckService } from './../services/deck.service';
import { DeckEntity } from './../entities/deck.entity';
import { UserService } from './../services/user.service';
import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUserEntity } from 'src/entities/game.user.entity';
import { AppDataSource } from 'src/dataSource';
import { ApolloDriver } from '@nestjs/apollo';
import { CardRepository } from 'src/repositories/card.repository';
import { DeckRepository } from 'src/repositories/deck.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([
      DeckEntity,
      CardEntity,
      DeckCardEntity,
      GameEntity,
      GameUserEntity,
      GameCardEntity,
      GameStateEntity,
    ]),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      introspection: true,
      typePaths: ['../schema/*.graphql'],
      definitions: {
        path: 'src/graphql/index.ts',
        outputAs: 'interface',
      },
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'CardRepository',
      useValue: CardRepository,
    },
    {
      provide: 'DeckRepository',
      useValue: DeckRepository,
    },
    UserService,
    DeckService,
    DeckResolver,
    CardService,
    CardResolver,
    DeckCardService,
    DeckCardResolver,
    GameService,
    GameResolver,
  ],
})
export class AppModule {}
