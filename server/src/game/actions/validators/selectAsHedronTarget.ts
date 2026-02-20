import { ActionType, GameActionDispatchInput } from 'src/graphql/index';
import { GameModel } from 'src/models/game.model';
import { BadRequestException } from '@nestjs/common';
import { SelectAsHedronTargetActionPayload } from 'src/game/actions/handlers/selectAsHedronTarget';

export function validateSelectAsHedronTargetAction(
  data: GameActionDispatchInput,
  game: GameModel,
): SelectAsHedronTargetActionPayload {
  const { gameCardId } = data.payload;

  if (!gameCardId) {
    throw new BadRequestException('gameCardId is required');
  }

  const gameCard = game.gameCards.find(gc => gc.id === gameCardId);
  if (!gameCard) {
    throw new BadRequestException(`GameCard with id ${gameCardId} not found`);
  }

  if (!gameCard.actionTypes.includes(ActionType.SELECT_AS_HEDRON_TARGET)) {
    throw new BadRequestException('The specified game card does not have the SELECT_AS_HEDRON_TARGET action type');
  }

  return { targetGameCard: gameCard };
}
