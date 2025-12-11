import { ActionType } from '../../../graphql/index';
import { GameModel } from '../../../models/game.model';
import { BadRequestException } from '@nestjs/common';
import { FinishEndTimeActionPayload } from '../handlers/finishEndTime';

export function validateFinishEndTimeAction(gameModel: GameModel, userId: string): FinishEndTimeActionPayload {
  const gameUser = gameModel.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.FINISH_END_TIME)) {
    throw new BadRequestException();
  }

  const opponentGameUser = gameModel.gameUsers.find(value => value.userId !== userId);

  if (!opponentGameUser) {
    throw new BadRequestException('Opponent game user not found');
  }

  return { gameUser, opponentGameUser };
}
