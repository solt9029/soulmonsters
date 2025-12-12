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

export function grantActions(gameModel: GameModel, userId: string) {
  grantStartDrawTimeAction(gameModel, userId);
  grantStartEnergyTimeAction(gameModel, userId);
  grantStartPutTimeAction(gameModel, userId);
  grantStartSomethingTimeAction(gameModel, userId);
  grantPutSoulAction(gameModel, userId);
  grantStartBattleTimeAction(gameModel, userId);
  grantSummonMonsterAction(gameModel, userId);
  grantAttackAction(gameModel, userId);
  grantStartEndTimeAction(gameModel, userId);
  grantFinishEndTimeAction(gameModel, userId);
  grantEffectRuteRuteDrawAction(gameModel, userId);

  return gameModel;
}
