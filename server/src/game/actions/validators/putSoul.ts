import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';
import { PutSoulActionPayload } from '../handlers/putSoul';

export function validatePutSoulAction(
  data: GameActionDispatchInput,
  game: GameEntity,
  userId: string,
): PutSoulActionPayload {
  const gameCard = game.gameCards.find(value => value.id === data.payload.gameCardId);

  if (!gameCard?.actionTypes?.includes(ActionType.PUT_SOUL)) {
    throw new BadRequestException();
  }

  const gameUser = game.gameUsers.find(value => value.userId === userId);

  if (gameUser?.userId !== game.turnUserId) {
    throw new BadRequestException();
  }

  return { gameCard, gameUser };
}
