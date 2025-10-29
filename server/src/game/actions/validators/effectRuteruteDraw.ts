import { ActionType, GameActionDispatchInput } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { GameCardEntity } from '../../../entities/game.card.entity';
import { GameUserEntity } from '../../../entities/game.user.entity';
import { BadRequestException } from '@nestjs/common';

export interface EffectRuteruteDrawValidationResult {
  gameCard: GameCardEntity;
  gameUser: GameUserEntity;
  gameCardId: number;
}

export function validateEffectRuteruteDrawAction(data: GameActionDispatchInput, game: GameEntity, userId: string): EffectRuteruteDrawValidationResult {
  const gameCardId = data.payload.gameCardId;
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

  // Validate energy cost (1 energy required for effect)
  if (gameUser.energy < 1) {
    throw new BadRequestException('Insufficient energy to use effect');
  }

  return { gameCard, gameUser, gameCardId };
}
