import { UserService } from 'src/services/user.service';
import { GameActionDispatchInput } from 'src/graphql/index';
import { GameService } from 'src/services/game.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';
import { grantActions } from 'src/game/actions/grantors/index';
import { reflectStates } from 'src/game/states/reflectors';
import { GamePresenter } from 'src/presenters/game.presenter';

@Resolver()
@UseGuards(AuthGuard)
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly gamePresenter: GamePresenter,
  ) {}

  @Query()
  async game(@User() user: auth.DecodedIdToken, @Args('id') id: number) {
    let gameEntity = await this.gameService.findById(id);

    if (!gameEntity) {
      throw new Error('Game not found');
    }

    const users = await Promise.all(
      gameEntity.gameUsers.map(async gameUser => {
        const { uid, displayName, photoURL } = await this.userService.findById(gameUser.userId);
        return { id: uid, displayName, photoURL };
      }),
    );

    gameEntity = reflectStates(gameEntity, user.uid);
    gameEntity = grantActions(gameEntity, user.uid);

    return this.gamePresenter.present(gameEntity, users);
  }

  @Query()
  async activeGameId(@User() user: auth.DecodedIdToken) {
    const activeGame = await this.gameService.findActiveGameByUserId(user.uid);
    return activeGame?.id;
  }

  @Mutation()
  async startGame(@User() user: auth.DecodedIdToken, @Args('deckId') deckId: number) {
    const gameEntity = await this.gameService.start(user.uid, deckId);

    if (!gameEntity) {
      throw new Error('Failed to start game');
    }

    return await this.game(user, gameEntity.id);
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
