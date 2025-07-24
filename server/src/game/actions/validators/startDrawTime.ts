import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validateStartDrawTimeAction(gameEntity: GameEntity, userId: string) {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.START_DRAW_TIME)) {
    throw new BadRequestException();
  }
}
