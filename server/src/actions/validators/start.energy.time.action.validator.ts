import { ActionType } from '../../graphql/index';
import { GameEntity } from '../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validateStartEnergyTimeAction(game: GameEntity, userId: string) {
  const yourGameUserIndex = game.gameUsers.findIndex(value => value.userId === userId);
  if (!game.gameUsers[yourGameUserIndex].actionTypes.includes(ActionType.START_ENERGY_TIME)) {
    throw new BadRequestException();
  }
}
