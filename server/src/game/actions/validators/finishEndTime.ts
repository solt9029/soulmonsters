import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';
import { FinishEndTimeActionPayload } from '../handlers/finishEndTime';

export function validateFinishEndTimeAction(gameEntity: GameEntity, userId: string): FinishEndTimeActionPayload {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.FINISH_END_TIME)) {
    throw new BadRequestException();
  }

  const opponentGameUser = gameEntity.gameUsers.find(value => value.userId !== userId);

  if (!opponentGameUser) {
    throw new BadRequestException('Opponent game user not found');
  }

  return { gameUser, opponentGameUser };
}
