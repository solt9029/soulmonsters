import { ActionType } from '../../graphql/index';
import { GameEntity } from '../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validateStartDrawTimeAction(
  gameEntity: GameEntity,
  userId: string,
) {
  const yourGameUserIndex = gameEntity.gameUsers.findIndex(
    value => value.userId === userId,
  );
  if (
    !gameEntity.gameUsers[yourGameUserIndex].actionTypes.includes(
      ActionType.START_DRAW_TIME,
    )
  ) {
    throw new BadRequestException();
  }
}
