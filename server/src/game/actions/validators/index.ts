import { GameActionDispatchInput } from '../../../graphql/index';
import { ActionType } from '../../../graphql/index';
import { GameEntity } from '../../../entities/game.entity';
import { validateStartDrawTimeAction } from './startDrawTime';
import { validateStartEnergyTimeAction } from './startEnergyTime';
import { validatePutSoulAction, PutSoulValidationResult } from './putSoul';
import { validateAttackAction } from './attack';

export type ValidationResult = PutSoulValidationResult | void;

export function validateActions(data: GameActionDispatchInput, grantedGame: GameEntity, userId: string): ValidationResult {
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
