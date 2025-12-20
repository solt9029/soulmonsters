import { ActionType, GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';
import { EffectFreshFishDrawActionPayload } from '../handlers/effectFreshFishDraw';

export function validateEffectFreshFishDrawAction(
  data: GameActionDispatchInput,
  game: GameModel,
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

  return { gameCard };
}
