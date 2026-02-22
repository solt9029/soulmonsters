import { Injectable } from '@nestjs/common';
import { GameModel } from '../../../models/game.model';
import { ActionType, EffectType } from '../../../graphql/index';
import { GameCardModel } from '../../../models/game-card.model';
import { GameUserModel } from '../../../models/game-user.model';
import { GameChainStatus } from '../../../models/game-chain.model';
import { GameChainLinkStatus } from '../../../models/game-chain-link.model';
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
import { grantEffectSupernewvoltsDestroyMonsterAction } from './effectSupernewvoltsDestroyMonster';
import { grantEffectSpeedDragonBirdChangePositionAction } from './effectSpeedDragonBirdChangePosition';
import { grantChangeBattlePositionAction } from './changeBattlePosition';
import { grantUseSoulCanonAction } from './useSoulCanon';
import { grantSelectAsHamontakiTargetAction } from './selectAsHamontakiTarget';
import { grantUseHedronAction } from './useHedron';
import { grantSelectAsHedronTargetAction } from './selectAsHedronTarget';

function pipe<T>(initialValue: T, ...fns: Array<(arg: T) => T>): T {
  return fns.reduce((acc, fn) => fn(acc), initialValue);
}

const EXCLUSIVE_ACTION_TYPES: ActionType[] = [
  ActionType.SELECT_AS_HAMONTAKI_TARGET,
  ActionType.SELECT_AS_HEDRON_TARGET,
];

function hasResolvingExclusiveEffect(gameModel: GameModel): boolean {
  const resolvingChain = gameModel.gameChains.find(c => c.status === GameChainStatus.RESOLVING);
  if (!resolvingChain) return false;

  const resolvingLink = resolvingChain.gameChainLinks.find(cl => cl.status === GameChainLinkStatus.RESOLVING);
  if (!resolvingLink) return false;

  const { effect } = resolvingLink;
  return (
    (effect.type === EffectType.HAMONTAKI_SPECIAL_SUMMON && effect.selectedGameCardId === undefined) ||
    (effect.type === EffectType.HEDRON_SPECIAL_SUMMON && effect.selectedGameCardId === undefined)
  );
}

function clearNonExclusiveActions(gameModel: GameModel): GameModel {
  if (!hasResolvingExclusiveEffect(gameModel)) {
    return gameModel;
  }

  gameModel.gameCards = gameModel.gameCards.map(gc => {
    const exclusiveActions = gc.actionTypes.filter(at => EXCLUSIVE_ACTION_TYPES.includes(at));
    return new GameCardModel({ ...gc, actionTypes: exclusiveActions });
  });

  gameModel.gameUsers = gameModel.gameUsers.map(gu => {
    const exclusiveActions = gu.actionTypes.filter(at => EXCLUSIVE_ACTION_TYPES.includes(at));
    return new GameUserModel({ ...gu, actionTypes: exclusiveActions });
  });

  return gameModel;
}

@Injectable()
export class GameActionGrantor {
  grantActions(gameModel: GameModel, userId: string): GameModel {
    if (gameModel.endedAt !== null) {
      return gameModel;
    }

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
      model => grantEffectSupernewvoltsDestroyMonsterAction(model, userId),
      model => grantEffectSpeedDragonBirdChangePositionAction(model, userId),
      model => grantUseSoulCanonAction(model, userId),
      model => grantUseHedronAction(model, userId),
      model => grantSelectAsHamontakiTargetAction(model, userId),
      model => grantSelectAsHedronTargetAction(model, userId),
      model => clearNonExclusiveActions(model),
    );
  }
}
