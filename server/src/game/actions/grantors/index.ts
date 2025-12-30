import { Injectable } from '@nestjs/common';
import { GameModel } from '../../../models/game.model';
import { grantStartDrawTimeAction } from './startDrawTime';
import { grantStartEnergyTimeAction } from './startEnergyTime';
import { grantStartPutTimeAction } from './startPutTime';
import { grantStartSomethingTimeAction } from './startSomethingTime';
import { grantPutSoulAction } from './putSoul';
import { grantStartBattleTimeAction } from './startBattleTime';
import { grantSummonMonsterAction } from './summonMonster';
import { grantAttackAction } from './attack';
import { grantStartEndTimeAction } from './startEndTime';
import { grantFinishEndTimeAction } from './finishEndTime';
import { grantEffectRuteRuteDrawAction } from './effectRuteruteDraw';
import { grantEffectFreshFishDrawAction } from './effectFreshFishDraw';
import { grantEffectNatsukashinorudePowerDownAction } from './effectNatsukashinorudePowerDown';
import { grantEffectEmeraldEnergyIncreaseAction } from './effectEmeraldEnergyIncrease';
import { grantChangeBattlePositionAction } from './changeBattlePosition';
import { grantUseSoulCanonAction } from './useSoulCanon';

function pipe<T>(initialValue: T, ...fns: Array<(arg: T) => T>): T {
  return fns.reduce((acc, fn) => fn(acc), initialValue);
}

@Injectable()
export class GameActionGrantor {
  grantActions(gameModel: GameModel, userId: string): GameModel {
    return pipe(
      gameModel,
      model => grantStartDrawTimeAction(model, userId),
      model => grantStartEnergyTimeAction(model, userId),
      model => grantStartPutTimeAction(model, userId),
      model => grantStartSomethingTimeAction(model, userId),
      model => grantPutSoulAction(model, userId),
      model => grantChangeBattlePositionAction(model, userId),
      model => grantStartBattleTimeAction(model, userId),
      model => grantSummonMonsterAction(model, userId),
      model => grantAttackAction(model, userId),
      model => grantStartEndTimeAction(model, userId),
      model => grantFinishEndTimeAction(model, userId),
      model => grantEffectRuteRuteDrawAction(model, userId),
      model => grantEffectFreshFishDrawAction(model, userId),
      model => grantEffectNatsukashinorudePowerDownAction(model, userId),
      model => grantEffectEmeraldEnergyIncreaseAction(model, userId),
      model => grantUseSoulCanonAction(model, userId),
    );
  }
}
