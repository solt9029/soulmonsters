import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameCardEntity } from '../../../entities/game.card.entity';
import { GameUserEntity } from '../../../entities/game.user.entity';
import { BadRequestException } from '@nestjs/common';

export interface SummonMonsterValidationResult {
  gameCard: GameCardEntity;
  gameCardId: number;
  gameUser: GameUserEntity;
}

export function validateSummonMonsterAction(data: GameActionDispatchInput, game: GameEntity, userId: string): SummonMonsterValidationResult {
  const gameCardId = data.payload.gameCardId;
  if (gameCardId === undefined) {
    throw new BadRequestException('Game card ID is required');
  }

  const gameCard = game.gameCards.find(value => value.id === gameCardId);
  const gameUser = game.gameUsers.find(value => value.userId === userId);
  
  if (!gameCard?.actionTypes?.includes(ActionType.SUMMON_MONSTER) || 
      game.turnUserId !== userId || 
      !gameUser) {
    throw new BadRequestException('召喚の処理に失敗しました');
  }

  // Check if user has enough energy
  const cardCost = gameCard.card?.cost || 0;
  if (gameUser.energy == null || gameUser.energy < cardCost) {
    throw new BadRequestException('エナジーが不足しています');
  }
  
  return { gameCard, gameCardId, gameUser };
}