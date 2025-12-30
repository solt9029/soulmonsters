import { ActionType, GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';
import { EffectEmeraldEnergyIncreaseActionPayload } from '../handlers/effectEmeraldEnergyIncrease';

export function validateEffectEmeraldEnergyIncreaseAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): EffectEmeraldEnergyIncreaseActionPayload {
  const { gameCardId } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  const gameCard = game.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_EMERALD_ENERGY_INCREASE)) {
    throw new BadRequestException(
      'The specified game card does not have the EFFECT_EMERALD_ENERGY_INCREASE action type',
    );
  }

  return { gameCard };
}
