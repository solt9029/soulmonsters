import { ActionType, GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';
import { EffectFreshFishDrawActionPayload } from '../handlers/effectFreshFishDraw';

const FRESH_FISH_DRAW_COST = 3;

export function validateEffectFreshFishDrawAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): EffectFreshFishDrawActionPayload {
  const { gameCardId } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  const gameCard = game.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_FRESH_FISH_DRAW)) {
    throw new BadRequestException('The specified game card does not have the EFFECT_FRESH_FISH_DRAW action type');
  }

  const gameUser = game.gameUsers.find(gu => gu.userId === userId);
  if (!gameUser) {
    throw new BadRequestException(`User with id ${userId} not found in game`);
  }

  if (gameUser.energy < FRESH_FISH_DRAW_COST) {
    throw new BadRequestException(
      `Insufficient energy. Required: ${FRESH_FISH_DRAW_COST}, Available: ${gameUser.energy}`,
    );
  }

  return { gameCard };
}
