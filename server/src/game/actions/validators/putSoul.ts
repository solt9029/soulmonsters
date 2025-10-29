import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameCardEntity } from '../../../entities/game.card.entity';
import { GameUserEntity } from '../../../entities/game.user.entity';
import { BadRequestException } from '@nestjs/common';

export interface PutSoulValidationResult {
  gameCard: GameCardEntity;
  gameUser: GameUserEntity;
  gameCardId: number;
}

export function validatePutSoulAction(data: GameActionDispatchInput, game: GameEntity, userId: string): PutSoulValidationResult {
  const gameCardId = data.payload.gameCardId;
  if (gameCardId === undefined) {
    throw new BadRequestException('Game card ID is required');
  }

  const gameCard = game.gameCards.find(value => value.id === gameCardId);
  const gameUser = game.gameUsers.find(value => value.userId === userId);

  if (!gameCard?.actionTypes?.includes(ActionType.PUT_SOUL) || 
      game.turnUserId !== userId || 
      !gameUser) {
    throw new BadRequestException();
  }

  return { gameCard, gameUser, gameCardId };
}
