import { ActionType, GameActionDispatchInput, Zone } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';
import { EffectFreshFishDrawActionPayload } from '../handlers/effectFreshFishDraw';

const FRESH_FISH_DRAW_SOUL_COST = 3;

export function validateEffectFreshFishDrawAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): EffectFreshFishDrawActionPayload {
  const { gameCardId, costGameCardIds } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  if (!costGameCardIds || costGameCardIds.length !== FRESH_FISH_DRAW_SOUL_COST) {
    throw new BadRequestException(`costGameCardIds must contain exactly ${FRESH_FISH_DRAW_SOUL_COST} cards`);
  }

  const gameCard = game.gameCards.find(gameCard => gameCard.id === gameCardId);

  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.EFFECT_FRESH_FISH_DRAW)) {
    throw new BadRequestException('The specified game card does not have the EFFECT_FRESH_FISH_DRAW action type');
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

  return { gameCard, costGameCards };
}
