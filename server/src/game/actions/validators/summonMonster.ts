import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameCardEntity } from '../../../entities/game.card.entity';
import { GameUserEntity } from '../../../entities/game.user.entity';
import { BadRequestException } from '@nestjs/common';

export interface SummonMonsterValidationResult {
  gameCard: GameCardEntity;
  gameUser: GameUserEntity;
  gameCardId: number;
}

export function validateSummonMonsterAction(data: GameActionDispatchInput, game: GameEntity, userId: string): SummonMonsterValidationResult {
  const gameCardId = data.payload.gameCardId;
  if (gameCardId === undefined) {
    throw new BadRequestException('Game card ID is required');
  }

  const gameCard = game.gameCards.find(value => value.id === gameCardId);
  const gameUser = game.gameUsers.find(value => value.userId === userId);

  if (!gameCard?.actionTypes?.includes(ActionType.SUMMON_MONSTER) || game.turnUserId !== userId || !gameUser) {
    throw new BadRequestException();
  }

  // Validate energy cost
  if (gameUser.energy < gameCard.card.cost) {
    throw new BadRequestException('Insufficient energy to summon monster');
  }

  return { gameCard, gameUser, gameCardId };
}