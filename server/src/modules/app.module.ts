import { GameStateEntity } from 'src/entities/game.state.entity';
import { GameCardEntity } from 'src/entities/game.card.entity';
import { GameResolver } from 'src/resolvers/game.resolver';
import { GameService } from 'src/services/game.service';
import { GameEntity } from 'src/entities/game.entity';
import { DeckCardResolver } from 'src/resolvers/deck.card.resolver';
import { DeckCardEntity } from 'src/entities/deck.card.entity';
import { CardEntity } from 'src/entities/card.entity';
import { CardResolver } from 'src/resolvers/card.resolver';
import { DeckResolver } from 'src/resolvers/deck.resolver';
import { DeckEntity } from 'src/entities/deck.entity';
import { UserService } from 'src/services/user.service';
import { Module } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUserEntity } from 'src/entities/game.user.entity';
import { AppDataSource } from 'src/dataSource';
import { ApolloDriver } from '@nestjs/apollo';
import { CardRepository } from 'src/repositories/card.repository';
import { DeckRepository } from 'src/repositories/deck.repository';
import { DeckCardRepository } from 'src/repositories/deck.card.repository';
import { CardPresenter } from 'src/presenters/card.presenter';
import { DeckCardPresenter } from 'src/presenters/deck-card.presenter';
import { DeckPresenter } from 'src/presenters/deck.presenter';
import { GameCardPresenter } from 'src/presenters/game.card.presenter';
import { GamePresenter } from 'src/presenters/game.presenter';
import { GameUserPresenter } from 'src/presenters/game.user.presenter';

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
    {
      provide: 'DeckCardRepository',
      useValue: DeckCardRepository,
    },
    UserService,
    DeckResolver,
    CardResolver,
    DeckCardResolver,
    GameService,
    GameResolver,
    CardPresenter,
    DeckCardPresenter,
    DeckPresenter,
    GameCardPresenter,
    GamePresenter,
    GameUserPresenter,
  ],
})
export class AppModule {}
