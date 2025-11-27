import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { BadRequestException } from '@nestjs/common';

export function validateStartBattleTimeAction(gameEntity: GameEntity, userId: string) {
  const gameUser = gameEntity.gameUsers.find(value => value.userId === userId);

  if (!gameUser?.actionTypes.includes(ActionType.START_BATTLE_TIME)) {
    throw new BadRequestException();
  }
}
