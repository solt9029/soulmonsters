import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validateFinishEndTimeAction(gameEntity: GameEntity, userId: string) {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.FINISH_END_TIME)) {
    throw new BadRequestException();
  }
}
