import { GameEntity } from '../../../entities/game.entity';
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
  grantEffectRuteRuteDrawAction(gameEntity, userId);

  return gameEntity;
}
