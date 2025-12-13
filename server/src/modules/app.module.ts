import { GameStateEntity } from 'src/entities/game-state.entity';
import { GameCardEntity } from 'src/entities/game-card.entity';
import { GameResolver } from 'src/resolvers/game.resolver';
import { GameService } from 'src/services/game.service';
import { GameEntity } from 'src/entities/game.entity';
import { DeckCardResolver } from 'src/resolvers/deck-card.resolver';
import { DeckCardEntity } from 'src/entities/deck-card.entity';
import { CardEntity } from 'src/entities/card.entity';
import { CardResolver } from 'src/resolvers/card.resolver';
import { DeckResolver } from 'src/resolvers/deck.resolver';
import { DeckEntity } from 'src/entities/deck.entity';
import { UserService } from 'src/services/user.service';
import { Module } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUserEntity } from 'src/entities/game-user.entity';
import { AppDataSource } from 'src/dataSource';
import { ApolloDriver } from '@nestjs/apollo';
import { CardRepository } from 'src/repositories/card.repository';
import { DeckRepository } from 'src/repositories/deck.repository';
import { DeckCardRepository } from 'src/repositories/deck-card.repository';
import { GameRepository } from 'src/repositories/game.repository';
import { GameCardRepository } from 'src/repositories/game-card.repository';
import { GameUserRepository } from 'src/repositories/game-user.repository';
import { CardPresenter } from 'src/presenters/card.presenter';
import { DeckCardPresenter } from 'src/presenters/deck-card.presenter';
import { DeckPresenter } from 'src/presenters/deck.presenter';
import { GameCardPresenter } from 'src/presenters/game-card.presenter';
import { GamePresenter } from 'src/presenters/game.presenter';
import { GameUserPresenter } from 'src/presenters/game-user.presenter';
import { CardToModelMapper } from 'src/mappers/to-model/card.to-model.mapper';
import { DeckToModelMapper } from 'src/mappers/to-model/deck.to-model.mapper';
import { DeckCardToModelMapper } from 'src/mappers/to-model/deck-card.to-model.mapper';
import { GameToModelMapper } from 'src/mappers/to-model/game.to-model.mapper';
import { GameCardToModelMapper } from 'src/mappers/to-model/game-card.to-model.mapper';
import { GameUserToModelMapper } from 'src/mappers/to-model/game-user.to-model.mapper';
import { GameStateToModelMapper } from 'src/mappers/to-model/game-state.to-model.mapper';
import { GameStateRepository } from 'src/repositories/game-state.repository';
import { GameActionGrantor } from 'src/game/actions/grantors/game.action.grantor';

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
    CardRepository,
    DeckRepository,
    DeckCardRepository,
    GameRepository,
    GameCardRepository,
    GameUserRepository,
    GameStateRepository,
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
    CardToModelMapper,
    DeckToModelMapper,
    DeckCardToModelMapper,
    GameToModelMapper,
    GameCardToModelMapper,
    GameUserToModelMapper,
    GameStateToModelMapper,
    GameActionGrantor,
  ],
})
export class AppModule {}
