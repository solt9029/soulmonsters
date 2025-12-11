import { ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';

export function validateStartSomethingTimeAction(gameModel: GameModel, userId: string) {
  const gameUser = gameModel.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.START_SOMETHING_TIME)) {
    throw new BadRequestException();
  }
}
