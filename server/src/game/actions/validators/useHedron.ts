import { ActionType, GameActionDispatchInput, Zone } from 'src/graphql/index';
import { GameModel } from 'src/models/game.model';
import { BadRequestException } from '@nestjs/common';
import { UseHedronActionPayload } from '../handlers/useHedron';

export function validateUseHedronAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): UseHedronActionPayload {
  const { gameCardId, costGameCardIds } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  const gameCard = game.gameCards.find(gc => gc.id === gameCardId);
  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.USE_HEDRON)) {
    throw new BadRequestException('The specified game card does not have the USE_HEDRON action type');
  }

  if (!costGameCardIds || costGameCardIds.length !== 3) {
    throw new BadRequestException('costGameCardIds must contain exactly 3 cards');
  }

  if (new Set(costGameCardIds).size !== costGameCardIds.length) {
    throw new BadRequestException('costGameCardIds must not contain duplicates');
  }

  const costGameCards = costGameCardIds.map(id => {
    const costGameCard = game.gameCards.find(gameCard => gameCard.id === id);
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

  return { costGameCards };
}
