import { UserService } from './../services/user.service';
import { GameActionDispatchInput } from './../graphql/index';
import { GameService } from './../services/game.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';
import { grantActions } from 'src/game/actions/grantors/index';
import { reflectStates } from 'src/game/states/reflectors';

@Resolver()
@UseGuards(AuthGuard)
export class GameResolver {
  constructor(private readonly gameService: GameService, private readonly userService: UserService) {}

  @Query()
  async game(@User() user: auth.DecodedIdToken, @Args('id') id: number) {
    let gameEntity = await this.gameService.findById(id);

    gameEntity.gameUsers = await Promise.all(
      gameEntity.gameUsers.map(async gameUser => {
        const { uid, displayName, photoURL } = await this.userService.findById(gameUser.userId);
        gameUser.user = { id: uid, displayName, photoURL };
        return gameUser;
      }),
    );

    gameEntity = reflectStates(gameEntity, user.uid);
    gameEntity = grantActions(gameEntity, user.uid);

    return gameEntity;
  }

  @Query()
  async activeGameId(@User() user: auth.DecodedIdToken) {
    const activeGame = await this.gameService.findActiveGameByUserId(user.uid);
    return activeGame?.id;
  }

  @Mutation()
  async startGame(@User() user: auth.DecodedIdToken, @Args('deckId') deckId: number) {
    return await this.gameService.start(user.uid, deckId);
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
