import { ActionType, GameActionDispatchInput } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';

export type SummonMonsterActionPayload = {
  gameCardId: number;
  cost: number;
};

export function validateSummonMonsterAction(
  data: GameActionDispatchInput,
  game: GameModel,
  userId: string,
): SummonMonsterActionPayload {
  const { gameCardId } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  const gameCard = game.gameCards.find(card => card.id === gameCardId);

  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.SUMMON_MONSTER)) {
    throw new BadRequestException('The specified game card does not have the SUMMON_MONSTER action type');
  }

  const cost = gameCard.card.cost ?? 0;

  const gameUser = game.gameUsers.find(gu => gu.userId === userId);
  if (!gameUser) {
    throw new BadRequestException(`User with id ${userId} not found in game`);
  }

  if (gameUser.energy < cost) {
    throw new BadRequestException(`Insufficient energy. Required: ${cost}, Available: ${gameUser.energy}`);
  }

  return { gameCardId, cost };
}
