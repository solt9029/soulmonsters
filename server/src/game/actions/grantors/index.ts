import { GameEntity } from '../../../entities/game.entity';
import { grantStartDrawTimeAction } from './grantStartDrawTimeAction';
import { grantStartEnergyTimeAction } from './grantStartEnergyTimeAction';
import { grantStartPutTimeAction } from './grantStartPutTimeAction';
import { grantStartSomethingTimeAction } from './grantStartSomethingTimeAction';
import { grantPutSoulAction } from './grantPutSoulAction';
import { grantStartBattleTimeAction } from './grantStartBattleTimeAction';
import { grantSummonMonsterAction } from './grantSummonMonsterAction';
import { grantAttackAction } from './grantAttackAction';
import { grantStartEndTimeAction } from './grantStartEndTimeAction';
import { grantFinishEndTimeAction } from './grantFinishEndTimeAction';

export function grantActions(gameEntity: GameEntity, userId: string) {
  grantStartDrawTimeAction(gameEntity, userId);
  grantStartEnergyTimeAction(gameEntity, userId);
  grantStartPutTimeAction(gameEntity, userId);
  grantStartSomethingTimeAction(gameEntity, userId);
  grantPutSoulAction(gameEntity, userId);
  grantStartBattleTimeAction(gameEntity, userId);
  grantSummonMonsterAction(gameEntity, userId);
  grantAttackAction(gameEntity, userId);
  grantStartEndTimeAction(gameEntity, userId);
  grantFinishEndTimeAction(gameEntity, userId);

  return gameEntity;
}
