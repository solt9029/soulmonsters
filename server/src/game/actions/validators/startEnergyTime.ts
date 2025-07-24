import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validateStartEnergyTimeAction(game: GameEntity, userId: string) {
  const gameUser = game.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.START_ENERGY_TIME)) {
    throw new BadRequestException();
  }
}
