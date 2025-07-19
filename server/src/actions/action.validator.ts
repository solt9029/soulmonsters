import { GameActionDispatchInput } from '../graphql/index';
import { ActionType } from '../graphql/index';
import { GameEntity } from '../entities/game.entity';
import { validateStartDrawTimeAction } from './validators/start.draw.time.action.validator';
import { validateStartEnergyTimeAction } from './validators/start.energy.time.action.validator';
import { validatePutSoulAction } from './validators/put.soul.action.validator';
import { validateAttackAction } from './validators/attack.action.validator';

export function validateActions(data: GameActionDispatchInput, grantedGame: GameEntity, userId: string) {
  switch (data.type) {
    case ActionType.START_DRAW_TIME:
      return validateStartDrawTimeAction(grantedGame, userId);
    case ActionType.START_ENERGY_TIME:
      return validateStartEnergyTimeAction(grantedGame, userId);
    case ActionType.PUT_SOUL:
      return validatePutSoulAction(data, grantedGame, userId);
    case ActionType.ATTACK:
      return validateAttackAction(data, grantedGame, userId);
    default:
      return;
  }
}
