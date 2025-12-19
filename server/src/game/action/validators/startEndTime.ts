import { ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';

export function validateStartEndTimeAction(gameModel: GameModel, userId: string) {
  const gameUser = gameModel.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.START_END_TIME)) {
    throw new BadRequestException();
  }
}
