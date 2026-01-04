import { ActionType, GameActionDispatchInput, Zone } from 'src/graphql/index';
import { GameModel } from 'src/models/game.model';
import { BadRequestException } from '@nestjs/common';
import { EffectSpeedDragonBirdChangePositionActionPayload } from '../handlers/effectSpeedDragonBirdChangePosition';

const SPEED_DRAGON_BIRD_SOUL_COST = 3;

export function validateEffectSpeedDragonBirdChangePositionAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): EffectSpeedDragonBirdChangePositionActionPayload {
  const { gameCardId, costGameCardIds, targetGameCardIds } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  if (!costGameCardIds || costGameCardIds.length !== SPEED_DRAGON_BIRD_SOUL_COST) {
    throw new BadRequestException(
      `costGameCardIds must contain exactly ${SPEED_DRAGON_BIRD_SOUL_COST} cards`,
    );
  }

  if (!targetGameCardIds || targetGameCardIds.length !== 1) {
    throw new BadRequestException('targetGameCardIds must contain exactly one target');
  }

  const gameCard = game.gameCards.find(card => card.id === gameCardId);

  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_SPEED_DRAGON_BIRD_CHANGE_POSITION)) {
    throw new BadRequestException(
      'The specified game card does not have the EFFECT_SPEED_DRAGON_BIRD_CHANGE_POSITION action type',
    );
  }

  const costGameCards = costGameCardIds.map(id => {
    const costGameCard = game.gameCards.find(card => card.id === id);
    if (!costGameCard) {
      throw new BadRequestException(`Cost card with id ${id} not found`);
    }
    if (costGameCard.currentUserId !== userId) {
      throw new BadRequestException(`Cost card ${id} does not belong to the current user`);
    }
    if (costGameCard.zone !== Zone.SOUL) {
      throw new BadRequestException(`Cost card ${id} is not in the SOUL zone`);
    }
    return costGameCard;
  });

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

  if (targetGameCard.battlePosition === null) {
    throw new BadRequestException('Target game card does not have a battle position');
  }

  return { gameCard, costGameCards, targetGameCard };
}
