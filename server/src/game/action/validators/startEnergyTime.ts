import { ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';

export function validateStartEnergyTimeAction(game: GameModel, userId: string) {
  const gameUser = game.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.START_ENERGY_TIME)) {
    throw new BadRequestException();
  }
}
