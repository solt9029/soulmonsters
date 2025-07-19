import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validatePutSoulAction(data: GameActionDispatchInput, game: GameEntity, userId: string) {
  const gameCard = game.gameCards.find(value => value.id === data.payload.gameCardId);
  if (!gameCard?.actionTypes?.includes(ActionType.PUT_SOUL) || game.turnUserId !== userId) {
    throw new BadRequestException();
  }
}
