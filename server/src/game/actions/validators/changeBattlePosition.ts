import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';
import { ChangeBattlePositionActionPayload } from '../handlers/changeBattlePosition';

export function validateChangeBattlePositionAction(
  data: GameActionDispatchInput,
  game: GameModel,
): ChangeBattlePositionActionPayload {
  const gameCard = game.gameCards.find(value => value.id === data.payload.gameCardId);

  if (!gameCard?.actionTypes?.includes(ActionType.CHANGE_BATTLE_POSITION)) {
    throw new BadRequestException();
  }

  return { gameCard };
}
