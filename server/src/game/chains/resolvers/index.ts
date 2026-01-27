import { GameModel } from 'src/models/game.model';
import { GameChainLinkModel, GameChainLinkStatus } from 'src/models/game-chain-link.model';
import { EffectType } from 'src/graphql/index';
import { resolveRuteruteDraw } from './ruteruteDraw';
import { resolveNatsukashinorudePowerDown } from './natsukashinorudePowerDown';
import { resolveSupernewvoltsDestroyMonster } from './supernewvoltsDestroyMonster';
import { resolveEmeraldEnergyIncrease } from './emeraldEnergyIncrease';
import { resolveFreshFishDraw } from './freshFishDraw';
import { resolveSpeedDragonBirdChangePosition } from './speedDragonBirdChangePosition';
import { resolveSoulCanon } from './soulCanon';
import { resolveShimashimajuniorEnergyTransfer } from './shimashimajuniorEnergyTransfer';
import { getResolvingGameChain } from 'src/game/selectors/getResolvingGameChain';
import { markGameChainAsResolved } from 'src/game/mutations/markGameChainAsResolved';
import { markGameChainLinkAsResolving } from 'src/game/mutations/markGameChainLinkAsResolving';
import { getGameChainLink } from 'src/game/selectors/getGameChainLink';

const sortLinksByOrderIndexDesc = (links: GameChainLinkModel[]) => {
  return [...links].sort((a, b) => b.orderIndex - a.orderIndex);
};

export class ChainResolver {
  resolveChain(gameModel: GameModel): GameModel {
    const resolvingGameChain = getResolvingGameChain(gameModel);
    if (resolvingGameChain === undefined) {
      return gameModel;
    }

    const links = sortLinksByOrderIndexDesc(resolvingGameChain.gameChainLinks);

    for (const link of links) {
      if (link.status === GameChainLinkStatus.RESOLVED) {
        continue;
      }

      if (link.status === GameChainLinkStatus.WAITING) {
        gameModel = markGameChainLinkAsResolving(gameModel, resolvingGameChain, link);
      }

      gameModel = this.resolveChainLink(gameModel, link);

      const updatedLink = getGameChainLink(gameModel, link.id);
      if (updatedLink?.status !== GameChainLinkStatus.RESOLVED) {
        return gameModel;
      }
    }

    gameModel = markGameChainAsResolved(gameModel, resolvingGameChain.id);

    return gameModel;
  }

  private resolveChainLink(gameModel: GameModel, gameChainLink: GameChainLinkModel): GameModel {
    switch (gameChainLink.effect.type) {
      case EffectType.RUTERUTE_DRAW: {
        return resolveRuteruteDraw(gameModel, gameChainLink);
      }
      case EffectType.FRESH_FISH_DRAW: {
        return resolveFreshFishDraw(gameModel, gameChainLink);
      }
      case EffectType.NATSUKASHINORUDE_POWER_DOWN: {
        return resolveNatsukashinorudePowerDown(gameModel, gameChainLink);
      }
      case EffectType.SUPERNEWVOLTS_DESTROY_MONSTER: {
        return resolveSupernewvoltsDestroyMonster(gameModel, gameChainLink);
      }
      case EffectType.EMERALD_ENERGY_INCREASE: {
        return resolveEmeraldEnergyIncrease(gameModel, gameChainLink);
      }
      case EffectType.SPEED_DRAGON_BIRD_CHANGE_POSITION: {
        return resolveSpeedDragonBirdChangePosition(gameModel, gameChainLink);
      }
      case EffectType.SOUL_CANON: {
        return resolveSoulCanon(gameModel, gameChainLink);
      }
      case EffectType.SHIMASHIMAJUNIOR_ENERGY_TRANSFER: {
        return resolveShimashimajuniorEnergyTransfer(gameModel, gameChainLink);
      }
    }
  }
}
