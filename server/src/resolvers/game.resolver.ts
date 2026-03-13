import { UserService } from 'src/services/user.service';
import { Game, GameActionDispatchInput } from 'src/graphql/index';
import { GameService } from 'src/services/game.service';
import { GameRepository } from 'src/repositories/game.repository';
import { GameLogRepository } from 'src/repositories/game-log.repository';
import { AuthGuard } from 'src/guards/auth.guard';
import { Resolver, Mutation, Args, Query, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';
import { GameActionGrantor } from 'src/game/actions/grantors';
import { GameStateReflector } from 'src/game/states/reflectors';
import { GamePresenter } from 'src/presenters/game.presenter';
import { GameLogPresenter } from 'src/presenters/game-log.presenter';

@Resolver('Game')
@UseGuards(AuthGuard)
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRepository: GameRepository,
    private readonly gameLogRepository: GameLogRepository,
    private readonly userService: UserService,
    private readonly gamePresenter: GamePresenter,
    private readonly gameLogPresenter: GameLogPresenter,
    private readonly gameActionGrantor: GameActionGrantor,
    private readonly gameStateReflector: GameStateReflector,
  ) {}

  @Query()
  async game(@User() user: auth.DecodedIdToken, @Args('id') id: number) {
    const gameModel = await this.gameRepository.findByIdWithRelations(id);

    if (!gameModel) {
      throw new Error('Game not found');
    }

    const users = await Promise.all(
      gameModel.gameUsers.map(async gameUser => {
        const { uid, displayName, photoURL } = await this.userService.findById(gameUser.userId);
        return { id: uid, displayName, photoURL };
      }),
    );

    const stateReflectedGameModel = this.gameStateReflector.reflectStates(gameModel, user.uid);
    const grantedGameModel = this.gameActionGrantor.grantActions(stateReflectedGameModel, user.uid);

    return this.gamePresenter.present(grantedGameModel, users);
  }

  @Query()
  async activeGameId(@User() user: auth.DecodedIdToken) {
    const activeGame = await this.gameRepository.findActiveGameByUserId(user.uid);
    return activeGame?.id;
  }

  @Query()
  async games(@User() user: auth.DecodedIdToken) {
    const gameModels = await this.gameRepository.findGamesByUserId(user.uid);

    return Promise.all(
      gameModels.map(async gameModel => {
        const users = await Promise.all(
          gameModel.gameUsers.map(async gameUser => {
            const { uid, displayName, photoURL } = await this.userService.findById(gameUser.userId);
            return { id: uid, displayName, photoURL };
          }),
        );
        return this.gamePresenter.present(gameModel, users);
      }),
    );
  }

  @Mutation()
  async startGame(@User() user: auth.DecodedIdToken, @Args('deckId') deckId: number) {
    const { displayName } = await this.userService.findById(user.uid);
    const gameEntity = await this.gameService.start(user.uid, deckId, displayName ?? null);

    if (!gameEntity) {
      throw new Error('Failed to start game');
    }

    return await this.game(user, gameEntity.id);
  }

  @ResolveField('gameLogs')
  async gameLogs(@Parent() game: Game) {
    const logs = await this.gameLogRepository.findByGameId(game.id);
    return logs.map(log => this.gameLogPresenter.present(log));
  }

  @Mutation()
  async dispatchGameAction(
    @User() user: auth.DecodedIdToken,
    @Args('id') id: number,
    @Args('data') data: GameActionDispatchInput,
  ) {
    await this.gameService.dispatchAction(id, user.uid, data);
    return await this.game(user, id);
  }
}
