import { GameEntity } from '../../entities/game.entity';
import { grantStartDrawTimeAction } from './start.draw.time.action.grantor';
import { grantStartEnergyTimeAction } from './start.energy.time.action.grantor';
import { grantStartPutTimeAction } from './start.put.time.action.grantor';
import { grantStartSomethingTimeAction } from './start.something.time.action.grantor';
import { grantPutSoulAction } from './put.soul.action.grantor';
import { grantStartBattleTimeAction } from './start.battle.time.action.grantor';
import { grantSummonMonsterAction } from './summon.monster.action.grantor';
import { grantAttackAction } from './attack.action.grantor';
import { grantStartEndTimeAction } from './start.end.time.action.grantor';
import { grantFinishEndTimeAction } from './finish.end.time.action.grantor';

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
