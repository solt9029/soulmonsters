import { GameEntity } from '../entities/game.entity';
import { Injectable } from '@nestjs/common';
import { grantStartDrawTimeAction } from './grantors/start.draw.time.action.grantor';
import { grantStartEnergyTimeAction } from './grantors/start.energy.time.action.grantor';
import { grantStartPutTimeAction } from './grantors/start.put.time.action.grantor';
import { grantStartSomethingTimeAction } from './grantors/start.something.time.action.grantor';
import { grantPutSoulAction } from './grantors/put.soul.action.grantor';
import { grantStartBattleTimeAction } from './grantors/start.battle.time.action.grantor';
import { grantSummonMonsterAction } from './grantors/summon.monster.action.grantor';
import { grantAttackAction } from './grantors/attack.action.grantor';
import { grantStartEndTimeAction } from './grantors/start.end.time.action.grantor';
import { grantFinishEndTimeAction } from './grantors/finish.end.time.action.grantor';

@Injectable()
export class ActionGrantor {
  grantActions(gameEntity: GameEntity, userId: string) {
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
}
