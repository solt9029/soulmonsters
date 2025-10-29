import { ActionType, GameActionDispatchInput } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameCardEntity } from '../../../entities/game.card.entity';
import { GameUserEntity } from '../../../entities/game.user.entity';
import { BadRequestException } from '@nestjs/common';

export interface EffectRuteruteDrawValidationResult {
  gameCard: GameCardEntity;
  gameCardId: number;
  gameUser: GameUserEntity;
}

export function validateEffectRuteruteDrawAction(data: GameActionDispatchInput, game: GameEntity, userId: string): EffectRuteruteDrawValidationResult {
  // check payload
  const { gameCardId } = data.payload;
  if (gameCardId === undefined) {
    throw new BadRequestException('Game card ID is required');
  }

  const gameCard = game.gameCards.find(gameCard => gameCard.id === gameCardId);
  const gameUser = game.gameUsers.find(value => value.userId === userId);

  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameUser) {
    throw new BadRequestException('Game user not found');
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_RUTERUTE_DRAW)) {
    throw new BadRequestException('The specified game card does not have the EFFECT_RUTERUTE_DRAW action type');
  }

  // Check if user has enough energy (effect costs 1 energy)
  if (gameUser.energy == null || gameUser.energy < 1) {
    throw new BadRequestException('エナジーが不足しています');
  }

  return { gameCard, gameCardId, gameUser };
}
