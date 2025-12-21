import { ActionType, GameActionDispatchInput, Zone } from 'src/graphql/index';
import { GameModel } from 'src/models/game.model';
import { BadRequestException } from '@nestjs/common';
import { EffectNatsukashinorudePowerDownActionPayload } from '../handlers/effectNatsukashinorudePowerDown';

export function validateEffectNatsukashinorudePowerDownAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): EffectNatsukashinorudePowerDownActionPayload {
  const { gameCardId, targetGameCardIds } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  if (!targetGameCardIds || targetGameCardIds.length !== 1) {
    throw new BadRequestException('targetGameCardIds must contain exactly one target');
  }

  const gameCard = game.gameCards.find(card => card.id === gameCardId);

  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_NATSUKASHINORUDE_POWER_DOWN)) {
    throw new BadRequestException('The specified game card does not have the EFFECT_NATSUKASHINORUDE_POWER_DOWN action type');
  }

  const targetGameCardId = targetGameCardIds[0];
  const targetGameCard = game.gameCards.find(card => card.id === targetGameCardId);

  if (!targetGameCard) {
    throw new BadRequestException(`Target game card with id ${targetGameCardId} not found`);
  }

  if (targetGameCard.zone !== Zone.BATTLE) {
    throw new BadRequestException('Target game card must be in the BATTLE zone');
  }

  if (targetGameCard.currentUserId === userId) {
    throw new BadRequestException('Cannot target own monster');
  }

  return { gameCard, targetGameCard };
}
